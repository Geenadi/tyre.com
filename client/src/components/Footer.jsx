import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      await api.subscribe(email);
      setStatus({ ok: true, msg: 'Thanks! Watch your inbox for tyre deals.' });
      setEmail('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="logo logo-footer">tyre<span className="logo-dot">.com</span></div>
          <p className="muted">
            Compare tyres from the world's leading brands, buy online and get them fitted at a store near
            you or at your home or work.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/tyres?category=Passenger">Passenger tyres</Link>
          <Link to="/tyres?category=SUV">SUV tyres</Link>
          <Link to="/tyres?category=4x4">4x4 &amp; ute tyres</Link>
          <Link to="/tyres?category=Performance">Performance tyres</Link>
          <Link to="/tyres?onSale=true">Current deals</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/services">Book a service</Link>
          <Link to="/stores">Find a store</Link>
          <Link to="/#faq">FAQs</Link>
          <Link to="/#size-guide">Tyre size guide</Link>
        </div>
        <div>
          <h4>Get exclusive deals</h4>
          <p className="footer-note">Member-only prices and seasonal offers. No spam, unsubscribe anytime.</p>
          <form onSubmit={subscribe} className="newsletter">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button className="btn btn-primary">Subscribe</button>
          </form>
          {status && <p className={status.ok ? 'ok-text' : 'error-text'}>{status.msg}</p>}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} tyre.com. Demo project, built for an internship task.</span>
        <span>Prices in AUD incl. GST</span>
      </div>
    </footer>
  );
}
