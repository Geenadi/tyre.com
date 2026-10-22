import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TyreImage from '../components/TyreImage.jsx';
import TyreCard from '../components/TyreCard.jsx';
import Stars from '../components/Stars.jsx';
import Icon from '../components/Icon.jsx';
import { api, money } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../components/Toast.jsx';

const labelClass = (grade) => `eu-grade grade-${grade.toLowerCase()}`;

export default function TyreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const toast = useToast();
  const [tyre, setTyre] = useState(null);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(4);

  useEffect(() => {
    let live = true;
    setTyre(null);
    setError(null);
    api.tyre(id).then((t) => live && setTyre(t)).catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [id]);

  useEffect(() => {
    if (tyre) {
      document.title = `${tyre.brandName} ${tyre.pattern} ${tyre.size} | tyre.com`;
      setQty(Math.min(4, Math.max(1, tyre.stock)));
    }
  }, [tyre]);

  if (error) {
    return (
      <div className="container page narrow center">
        <h1>Tyre not found</h1>
        <p className="muted">{error}</p>
        <Link to="/tyres" className="btn btn-primary">Browse all tyres</Link>
      </div>
    );
  }
  if (!tyre) return <div className="container page"><div className="loading">Loading…</div></div>;

  const soldOut = tyre.stock === 0;
  const maxQty = Math.min(8, tyre.stock);
  const addToCart = (goToCart) => {
    add(tyre, qty);
    if (goToCart) navigate('/cart');
    else toast(`Added ${qty} × ${tyre.brandName} ${tyre.pattern} to cart`);
  };

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <Icon name="chevron" size={14} />
        <Link to="/tyres">Tyres</Link> <Icon name="chevron" size={14} />
        <Link to={`/tyres?brand=${tyre.brand}`}>{tyre.brandName}</Link> <Icon name="chevron" size={14} />
        <span>{tyre.pattern}</span>
      </nav>

      <div className="detail">
        <div className="detail-media card">
          {tyre.rrp && <span className="badge badge-sale">Save {money(tyre.rrp - tyre.price)} per tyre</span>}
          <TyreImage brand={tyre.brand} terrain={tyre.terrain} size={320} label={`${tyre.brandName} ${tyre.pattern}`} />
        </div>

        <div className="detail-info">
          <Link to={`/tyres?brand=${tyre.brand}`} className="tyre-brand">{tyre.brandName}</Link>
          <h1>{tyre.pattern}</h1>
          <div className="detail-meta">
            <span className="tyre-size">{tyre.size} {tyre.loadIndex}{tyre.speedRating}</span>
            <Stars rating={tyre.rating} reviews={tyre.reviews} />
          </div>

          {tyre.otherSizes.length > 1 && (
            <div className="other-sizes">
              <span className="field-label">Available sizes</span>
              <div className="chips">
                {tyre.otherSizes.map((s) => (
                  <Link key={s.id} to={`/tyres/${s.id}`} className={`chip chip-link ${s.id === tyre.id ? 'active' : ''}`}>
                    {s.size}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ul className="feature-list">
            {tyre.features.map((f) => <li key={f}><Icon name="check" size={18} /> {f}</li>)}
          </ul>

          <div className="buy-box card">
            <div className="buy-price">
              <div className="price price-lg">{money(tyre.price)} <span className="price-unit">each</span></div>
              {tyre.rrp && <div className="rrp">was {money(tyre.rrp)}</div>}
              <div className="fitted">Includes fitting, balancing, new valves &amp; disposal</div>
            </div>

            <div className={`stock ${soldOut ? 'stock-out' : tyre.stock < 8 ? 'stock-low' : ''}`}>
              {soldOut ? 'Out of stock' : tyre.stock < 8 ? `Only ${tyre.stock} left in stock` : 'In stock, ready to fit'}
            </div>

            {!soldOut && (
              <>
                <div className="qty-row">
                  <span className="field-label">Quantity</span>
                  <div className="qty">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>−</button>
                    <span aria-live="polite">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Increase quantity" disabled={qty >= maxQty}>+</button>
                  </div>
                  <strong className="qty-total">{money(tyre.price * qty)}</strong>
                </div>
                <div className="buy-actions">
                  <button className="btn btn-primary btn-lg" onClick={() => addToCart(true)}>Buy now</button>
                  <button className="btn btn-outline btn-lg" onClick={() => addToCart(false)}>Add to cart</button>
                </div>
              </>
            )}
          </div>

          <ul className="assurances">
            <li><Icon name="shield" size={18} /> {(tyre.warrantyKm / 1000).toFixed(0)},000 km manufacturer warranty</li>
            <li><Icon name="truck" size={18} /> Mobile fitting available for $49</li>
            <li><Icon name="tag" size={18} /> Price beat guarantee</li>
          </ul>
        </div>
      </div>

      <section className="section">
        <h2>Specifications</h2>
        <div className="spec-grid">
          <table className="specs">
            <tbody>
              <tr><th>Brand</th><td>{tyre.brandName}</td></tr>
              <tr><th>Pattern</th><td>{tyre.pattern}</td></tr>
              <tr><th>Size</th><td>{tyre.size}</td></tr>
              <tr><th>Width / Profile / Rim</th><td>{tyre.width} mm / {tyre.profile}% / {tyre.rim}"</td></tr>
              <tr><th>Load index</th><td>{tyre.loadIndex}</td></tr>
              <tr><th>Speed rating</th><td>{tyre.speedRating}</td></tr>
              <tr><th>Category</th><td>{tyre.category}</td></tr>
              <tr><th>Terrain</th><td>{tyre.terrain}</td></tr>
              <tr><th>Warranty</th><td>{tyre.warrantyKm.toLocaleString('en-AU')} km</td></tr>
            </tbody>
          </table>
          <div className="labels card">
            <h3>Tyre label</h3>
            <div className="label-row"><span>Wet grip</span><span className={labelClass(tyre.labels.wetGrip)}>{tyre.labels.wetGrip}</span></div>
            <div className="label-row"><span>Fuel efficiency</span><span className={labelClass(tyre.labels.fuel)}>{tyre.labels.fuel}</span></div>
            <div className="label-row"><span>External noise</span><strong>{tyre.labels.noiseDb} dB</strong></div>
            <p className="hint">A is best. Lower noise is quieter.</p>
          </div>
        </div>
      </section>

      {tyre.alternatives.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Other tyres in {tyre.size}</h2>
            <Link to={`/tyres?size=${encodeURIComponent(tyre.size)}`} className="link-arrow">See all <Icon name="chevron" size={16} /></Link>
          </div>
          <div className="product-grid">
            {tyre.alternatives.map((t) => <TyreCard key={t.id} tyre={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
