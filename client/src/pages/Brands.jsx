import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { api } from '../api.js';

const TIERS = [
  { name: 'Premium', blurb: 'The best grip, comfort and longevity from the world\'s leading manufacturers.' },
  { name: 'Mid-range', blurb: 'Excellent performance and warranty at a sharper price.' },
  { name: 'Value', blurb: 'Quality, safe tyres for drivers on a budget.' },
];

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => { api.brands().then(setBrands).catch(() => {}); }, []);

  return (
    <div className="container page">
      <div className="page-intro">
        <h1>Tyre brands</h1>
        <p className="muted">We stock {brands.length} brands, so you can compare like-for-like and choose the right balance of price and performance.</p>
      </div>

      {TIERS.map((tier) => {
        const list = brands.filter((b) => b.tier === tier.name);
        if (!list.length) return null;
        return (
          <section key={tier.name} className="section-sm">
            <h2>{tier.name}</h2>
            <p className="muted">{tier.blurb}</p>
            <div className="brand-grid">
              {list.map((b) => (
                <Link key={b.id} to={`/tyres?brand=${b.id}`} className="brand-card card" style={{ '--brand': b.color }}>
                  <span className="brand-name">{b.name}</span>
                  <span className="muted">{b.count} tyres</span>
                  <span className="link-arrow">Shop {b.name} <Icon name="chevron" size={16} /></span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
