import { Link } from 'react-router-dom';
import TyreImage from './TyreImage.jsx';
import Stars from './Stars.jsx';
import { money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from './Toast.jsx';

export default function TyreCard({ tyre }) {
  const { add } = useCart();
  const toast = useToast();
  const soldOut = tyre.stock === 0;
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
        <button
          className="btn btn-dark btn-block"
          disabled={soldOut}
          onClick={() => {
            add(tyre, 4);
            toast(`Added 4 × ${tyre.brandName} ${tyre.pattern} to cart`);
          }}
        >
          {soldOut ? 'Out of stock' : 'Add set of 4'}
        </button>
      </div>
    </article>
  );
}
