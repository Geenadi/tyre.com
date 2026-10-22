// Keeps a copy of recent orders in the browser. On Vercel the API stores orders in /tmp,
// which is wiped when the function restarts, so the confirmation page falls back to this copy.
const KEY = 'tyrecom.orders';
const LIMIT = 10;

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  try {
    const rest = readAll().filter((o) => o.id !== order.id);
    localStorage.setItem(KEY, JSON.stringify([order, ...rest].slice(0, LIMIT)));
  } catch { /* storage unavailable */ }
}

export const findOrder = (id) => readAll().find((o) => o.id === id) || null;
