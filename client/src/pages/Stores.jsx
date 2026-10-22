import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { api } from '../api.js';

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA'];

export default function Stores() {
  const [state, setState] = useState('');
  const [q, setQ] = useState('');
  const [stores, setStores] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api.stores({ state, q: q.trim() }).then(setStores).catch(() => setStores([]));
    }, 200);
    return () => clearTimeout(t);
  }, [state, q]);

  return (
    <div className="container page">
      <div className="page-intro">
        <h1>Find a store</h1>
        <p className="muted">8 fitting centres across Australia, plus mobile fitting within 30 km of every store.</p>
      </div>

      <div className="store-tools">
        <div className="header-search">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search suburb or postcode" aria-label="Search stores" />
        </div>
        <div className="pill-group" role="group" aria-label="Filter by state">
          <button className={state === '' ? 'active' : ''} onClick={() => setState('')}>All</button>
          {STATES.map((s) => (
            <button key={s} className={state === s ? 'active' : ''} onClick={() => setState(s)}>{s}</button>
          ))}
        </div>
      </div>

      {stores && stores.length === 0 && (
        <div className="empty card">
          <h2>No stores found</h2>
          <p className="muted">Try another suburb, or choose mobile fitting at checkout.</p>
        </div>
      )}

      <div className="store-grid">
        {stores?.map((s) => (
          <article key={s.id} className="store-card card">
            <span className="chip">{s.state}</span>
            <h2>{s.name}</h2>
            <p><Icon name="pin" size={16} /> {s.address}</p>
            <p><Icon name="phone" size={16} /> <a href={`tel:${s.phone.replace(/\D/g, '')}`}>{s.phone}</a></p>
            <p><Icon name="clock" size={16} /> {s.hours}</p>
            <div className="store-actions">
              <Link to={`/services?store=${s.id}`} className="btn btn-primary">Book a service</Link>
              <a
                className="btn btn-outline"
                href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
