import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useCart } from '../context/CartContext.jsx';

// NavLink only compares pathnames, so Tyres and Deals (same path, different query) need their own check.
const links = [
  { to: '/tyres', label: 'Tyres', isActive: (l) => l.pathname.startsWith('/tyres') && !l.search.includes('onSale=true') },
  { to: '/tyres?onSale=true', label: 'Deals', isActive: (l) => l.pathname === '/tyres' && l.search.includes('onSale=true') },
  { to: '/brands', label: 'Brands' },
  { to: '/services', label: 'Services' },
  { to: '/stores', label: 'Find a store' },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = (e) => {
    e.preventDefault();
    setOpen(false);
    navigate(q.trim() ? `/tyres?q=${encodeURIComponent(q.trim())}` : '/tyres');
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span><Icon name="check" size={14} /> Every price includes fitting, balancing &amp; new valves</span>
          <span className="hide-sm"><Icon name="phone" size={14} /> 1300 TYRE COM</span>
        </div>
      </div>
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="none" stroke="#f5b700" strokeWidth="6" />
            <circle cx="32" cy="32" r="14" fill="none" stroke="#fff" strokeWidth="4" />
            <circle cx="32" cy="32" r="4" fill="#f5b700" />
          </svg>
          <span>tyre<span className="logo-dot">.com</span></span>
        </Link>

        <form className="header-search hide-md" onSubmit={submit} role="search">
          <Icon name="search" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brand, pattern or size (e.g. 265/65R17)"
            aria-label="Search tyres"
          />
        </form>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main">
          <form className="header-search show-md" onSubmit={submit} role="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tyres" aria-label="Search tyres" />
          </form>
          {links.map((l) => {
            const active = l.isActive ? l.isActive(location) : location.pathname.startsWith(l.to);
            return (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
          <Icon name="cart" size={24} />
          {count > 0 && <span className="cart-count">{count}</span>}
        </Link>
        <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  );
}
