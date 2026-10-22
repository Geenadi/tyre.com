import { Link, useNavigate } from 'react-router-dom';
import TyreImage from '../components/TyreImage.jsx';
import Icon from '../components/Icon.jsx';
import { money } from '../api.js';
import { useCart, maxQty } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, update, remove, count, subtotal, vehicle } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="container page narrow center">
        <div className="empty card">
          <Icon name="cart" size={48} />
          <h1>Your cart is empty</h1>
          <p className="muted">Search by vehicle or tyre size to find tyres that fit.</p>
          <Link to="/" className="btn btn-primary">Find tyres</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Your cart</h1>
      {vehicle && (
        <p className="muted"><Icon name="car" size={16} /> For your {vehicle.year} {vehicle.make} {vehicle.model}</p>
      )}

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((i) => (
            <li key={i.id} className="cart-item card">
              <Link to={`/tyres/${i.id}`} className="cart-item-img">
                <TyreImage brand={i.brand} size={90} label={`${i.brandName} ${i.pattern}`} />
              </Link>
              <div className="cart-item-info">
                <div className="tyre-brand">{i.brandName}</div>
                <Link to={`/tyres/${i.id}`} className="tyre-name">{i.pattern}</Link>
                <div className="tyre-size">{i.size}</div>
                <div className="muted">{money(i.price)} each, fitted</div>
              </div>
              <div className="qty">
                <button onClick={() => update(i.id, i.qty - 1)} aria-label="Decrease quantity" disabled={i.qty <= 1}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => update(i.id, i.qty + 1)} aria-label="Increase quantity" disabled={i.qty >= maxQty(i)}>+</button>
              </div>
              <strong className="cart-line-total">{money(i.price * i.qty)}</strong>
              <button className="icon-btn" onClick={() => remove(i.id)} aria-label={`Remove ${i.pattern}`}>
                <Icon name="trash" size={20} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary card">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Tyres ({count})</span><span>{money(subtotal)}</span></div>
          <div className="summary-row"><span>Fitting &amp; balancing</span><span className="ok-text">Included</span></div>
          <div className="summary-row"><span>Old tyre disposal</span><span className="ok-text">Included</span></div>
          <div className="summary-row summary-total"><span>Estimated total</span><span>{money(subtotal)}</span></div>
          <p className="hint">Mobile fitting and alignment can be added at checkout. Final price is confirmed when you book.</p>
          <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/checkout')}>
            Choose fitting &amp; book
          </button>
          <Link to="/tyres" className="btn-link center-block">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
