import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import TyreImage from '../components/TyreImage.jsx';
import { api } from '../api.js';

const TIERS = [
  {
    name: 'Premium',
    blurb: 'The best grip, comfort and longevity from the world\'s leading manufacturers.',
    perks: ['Top-rated wet braking', 'Longest tread-life warranties', 'OE fitment on prestige cars'],
  },
  {
    name: 'Mid-range',
    blurb: 'Excellent performance and warranty at a sharper price.',
    perks: ['Proven all-round performance', 'Strong warranties', 'Great value per kilometre'],
  },
  {
    name: 'Value',
    blurb: 'Quality, safe tyres for drivers on a budget.',
    perks: ['Meets all Australian standards', 'Lowest price per tyre', 'Ideal for daily commuting'],
  },
];

const tierId = (name) => `tier-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`;

// Average rating and tyre types per brand, worked out from the full catalogue.
function brandStats(tyres) {
  const stats = {};
  for (const t of tyres) {
    const s = (stats[t.brand] ??= { ratingSum: 0, n: 0, categories: new Set(), terrain: t.terrain });
    s.ratingSum += t.rating;
    s.n += 1;
    s.categories.add(t.category);
  }
  return stats;
}

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [tyres, setTyres] = useState([]);

  useEffect(() => {
    api.brands().then(setBrands).catch(() => {});
    api.tyres().then((r) => setTyres(r.items)).catch(() => {});
  }, []);

  const stats = useMemo(() => brandStats(tyres), [tyres]);
  const inStock = brands.reduce((sum, b) => sum + b.inStock, 0);

  return (
    <>
      <section className="brands-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <Icon name="chevron" size={14} /> <span>Brands</span>
          </nav>
          <div className="brands-hero-inner">
            <div>
              <span className="eyebrow">Our brands</span>
              <h1>Tyres from the names you trust</h1>
              <p>
                Compare like-for-like across {brands.length || 12} leading manufacturers and choose the right
                balance of price and performance. Every price includes fitting.
              </p>
            </div>
            <dl className="brands-stats">
              <div><dt>{brands.length || '–'}</dt><dd>Brands</dd></div>
              <div><dt>{inStock || '–'}</dt><dd>Tyres in stock</dd></div>
              <div><dt>{TIERS.length}</dt><dd>Price tiers</dd></div>
            </dl>
          </div>
          <div className="tier-jump" role="navigation" aria-label="Jump to tier">
            {TIERS.map((tier) => (
              <a key={tier.name} href={`#${tierId(tier.name)}`}>
                {tier.name}
                <span>{brands.filter((b) => b.tier === tier.name).length}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container page">
        {TIERS.map((tier, i) => {
          const list = brands.filter((b) => b.tier === tier.name);
          if (!list.length) return null;
          return (
            <section key={tier.name} id={tierId(tier.name)} className="tier">
              <header className="tier-head">
                <span className="tier-num">0{i + 1}</span>
                <h2>{tier.name}</h2>
                <p className="muted">{tier.blurb}</p>
                <ul className="tier-perks">
                  {tier.perks.map((p) => <li key={p}><Icon name="check" size={16} /> {p}</li>)}
                </ul>
              </header>

              <div className="brand-grid">
                {list.map((b) => {
                  const s = stats[b.id];
                  return (
                    <Link key={b.id} to={`/tyres?brand=${b.id}`} className="brand-card" style={{ '--brand': b.color }}>
                      <div className="brand-card-img">
                        <TyreImage brand={b.id} terrain={s?.terrain} size={104} label={`${b.name} tyre`} />
                      </div>
                      <div className="brand-card-body">
                        <span className="brand-name">{b.name}</span>
                        <span className="brand-meta">
                          {b.count} tyres
                          {s && <> · <span className="brand-rating">★ {(s.ratingSum / s.n).toFixed(1)}</span></>}
                        </span>
                        {s && <span className="brand-cats">{[...s.categories].join(' · ')}</span>}
                        <div className="brand-card-foot">
                          <span className="brand-shop">Shop {b.name}</span>
                          <span className="brand-go" aria-hidden="true"><Icon name="chevron" size={18} /></span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
