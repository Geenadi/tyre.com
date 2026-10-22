import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'tyrecom.cart';

// Most you can order of one tyre: 8, or fewer if that's all the stock left.
// Older saved carts have no stock snapshot, so they fall back to 8 and the server checks at checkout.
export const maxQty = (item) => Math.min(8, item.stock ?? 8);

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [vehicle, setVehicle] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tyrecom.vehicle')); } catch { return null; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  useEffect(() => {
    try { localStorage.setItem('tyrecom.vehicle', JSON.stringify(vehicle)); } catch { /* storage unavailable */ }
  }, [vehicle]);

  const value = useMemo(() => {
    // Each item stores a snapshot of the tyre for display; the server re-prices on checkout.
    const add = (tyre, qty = 4) =>
      setItems((cur) => {
        const existing = cur.find((i) => i.id === tyre.id);
        if (existing) {
          return cur.map((i) => (i.id === tyre.id ? { ...i, stock: tyre.stock, qty: Math.min(maxQty(tyre), i.qty + qty) } : i));
        }
        const { id, brandName, pattern, size, price, brand, category, stock } = tyre;
        return [...cur, { id, brandName, pattern, size, price, brand, category, stock, qty: Math.min(maxQty(tyre), qty) }];
      });
    const update = (id, qty) =>
      setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(maxQty(i), qty)) } : i)));
    const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
    const clear = () => setItems([]);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    return { items, add, update, remove, clear, count, subtotal, vehicle, setVehicle };
  }, [items, vehicle]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
