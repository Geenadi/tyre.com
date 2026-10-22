import { Link } from 'react-router-dom';
import TyreImage from './TyreImage.jsx';
import Stars from './Stars.jsx';
import { money } from '../api.js';
import { useCart, maxQty } from '../context/CartContext.jsx';
import { useToast } from './Toast.jsx';

export default function TyreCard({ tyre }) {
  const { add, items } = useCart();
  const toast = useToast();
  const soldOut = tyre.stock === 0;
  const inCart = items.find((i) => i.id === tyre.id)?.qty || 0;
  const room = maxQty(tyre) - inCart;
  // A set is 4, or whatever is left if stock is lower.
  const setQty = Math.min(4, tyre.stock);

  const addQty = (qty) => {
    const added = Math.min(qty, room);
    add(tyre, added);
    toast(`Added ${added} × ${tyre.brandName} ${tyre.pattern} to cart`);
  };
  const saving = tyre.rrp ? Math.round(((tyre.rrp - tyre.price) / tyre.rrp) * 100) : 0;

  return (
    <article className="tyre-card">
      <div className="tyre-card-badges">
        {saving > 0 && <span className="badge badge-sale">−{saving}%</span>}
        {!soldOut && tyre.stock < 8 && <span className="badge badge-low">Only {tyre.stock} left</span>}
      </div>
      <Link to={`/tyres/${tyre.id}`} className="tyre-card-img" tabIndex={-1} aria-hidden="true">
        <TyreImage brand={tyre.brand} terrain={tyre.terrain} size={160} label={`${tyre.brandName} ${tyre.pattern}`} />
      </Link>
      <div className="tyre-card-body">
        <div className="tyre-brand">{tyre.brandName}</div>
        <Link to={`/tyres/${tyre.id}`} className="tyre-name">{tyre.pattern}</Link>
        <div className="tyre-size">{tyre.size} · {tyre.loadIndex}{tyre.speedRating}</div>
        <Stars rating={tyre.rating} reviews={tyre.reviews} />
        <div className="tyre-meta">
          <span>{tyre.category}</span>
          <span>{tyre.terrain}</span>
          <span>{(tyre.warrantyKm / 1000).toFixed(0)}k km warranty</span>
        </div>
      </div>
      <div className="tyre-card-foot">
        <div className="price-block">
          <div className="price">
            {money(tyre.price)} <span className="price-unit">/ tyre</span>
          </div>
          {tyre.rrp ? <div className="rrp">{money(tyre.rrp)}</div> : <div className="fitted">Fitted &amp; balanced</div>}
        </div>
        {soldOut ? (
          <button className="btn btn-dark btn-block" disabled>Out of stock</button>
        ) : room <= 0 ? (
          <button className="btn btn-dark btn-block" disabled>Max in cart</button>
        ) : (
          <div className="card-actions">
            <button className="btn btn-outline" onClick={() => addQty(1)} aria-label={`Add 1 ${tyre.brandName} ${tyre.pattern} to cart`}>
              Add 1
            </button>
            {setQty > 1 && (
              <button className="btn btn-dark" onClick={() => addQty(setQty)}>
                {setQty === 4 ? 'Add set of 4' : `Add ${setQty}`}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
