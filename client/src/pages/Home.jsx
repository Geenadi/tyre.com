import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TyreSearch from '../components/TyreSearch.jsx';
import TyreCard from '../components/TyreCard.jsx';
import Icon from '../components/Icon.jsx';
import { api } from '../api.js';

const usps = [
  { icon: 'tag', title: 'Price beat guarantee', text: 'Found it cheaper? We\'ll beat it by 5%.' },
  { icon: 'wrench', title: 'Fitting included', text: 'Fitting, balancing & valves in every price.' },
  { icon: 'truck', title: 'Mobile fitting', text: 'We come to your home or workplace.' },
  { icon: 'shield', title: 'Road hazard warranty', text: '12 months cover on every new tyre.' },
];

// `focus` is the object-position that keeps the vehicle in frame when the photo is cropped.
const categories = [
  { name: 'Passenger', blurb: 'Comfort & economy for everyday cars', image: '/images/cat-passenger.jpg', focus: '45% 60%' },
  { name: 'SUV', blurb: 'Quiet and stable for family SUVs', image: '/images/cat-suv.jpg', focus: '85% 80%' },
  { name: '4x4', blurb: 'All-terrain & mud-terrain for utes', image: '/images/cat-4x4.jpg', focus: '30% 70%' },
  { name: 'Performance', blurb: 'Maximum grip for sports cars', image: '/images/cat-performance.jpg', focus: '70% 60%' },
];

const reviews = [
  { name: 'Sarah M.', where: 'Parramatta, NSW', text: 'Booked online at 9pm, tyres fitted at 8am next morning. Cheapest price I found by $120 for a set of four.' },
  { name: 'Daniel K.', where: 'Richmond, VIC', text: 'The vehicle search found the right size for my HiLux straight away. The mobile fitter came to my work. Brilliant.' },
  { name: 'Priya R.', where: 'Kedron, QLD', text: 'Really clear pricing with no surprise fees at the counter. The alignment add-on was worth it.' },
];

const faqs = [
  { q: 'Is fitting really included in the price?', a: 'Yes. Every tyre price includes fitting, wheel balancing, new valves and disposal of your old tyres at any tyre.com store. Mobile fitting is a flat $49 extra per order.' },
  { q: 'How do I know what tyre size I need?', a: 'Use "Search by vehicle" to see the factory sizes for your car, or read the size from the sidewall of your current tyres. See the size guide below.' },
  { q: 'Do I need to replace all four tyres?', a: 'Not always, but tyres should be replaced in pairs on the same axle. For 4WD and AWD vehicles we recommend replacing all four so the tread depths match.' },
  { q: 'Can I change my fitting appointment?', a: 'Yes. Call your fitting store or reply to your confirmation email up to 2 hours before your appointment.' },
  { q: 'What payment methods do you accept?', a: 'Pay in store on the day with card, Apple Pay, Google Pay or Afterpay. No payment is taken online for this demo.' },
];

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [brands, setBrands] = useState([]);
  const { hash } = useLocation();

  useEffect(() => {
    api.tyres({ onSale: 'true', inStock: 'true', sort: 'popular' }).then((r) => setDeals(r.items.slice(0, 8))).catch(() => {});
    api.brands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Australia-wide · 8 stores + mobile fitting</span>
            <h1>The right tyres at the best price, <span className="accent">fitted.</span></h1>
            <p>
              Compare over 100 tyres from 12 leading brands. Buy online and choose a fitting time at a store
              near you, or have a mobile fitter come to you.
            </p>
            <ul className="hero-points">
              <li><Icon name="check" size={16} /> Free fitting &amp; balancing</li>
              <li><Icon name="check" size={16} /> Pay in store on the day</li>
              <li><Icon name="check" size={16} /> Same-day fitting</li>
            </ul>
            <div className="hero-trust">
              <div><strong>4.8<span className="star">★</span></strong><span>12,000+ reviews</span></div>
              <hr />
              <div><strong>12</strong><span>Premium brands</span></div>
              <hr />
              <div><strong>8</strong><span>Fitting centres</span></div>
            </div>
          </div>
          <TyreSearch />
        </div>
      </section>

      <section className="usps">
        <div className="container usp-grid">
          {usps.map((u) => (
            <div key={u.title} className="usp">
              <Icon name={u.icon} size={28} />
              <div>
                <strong>{u.title}</strong>
                <span>{u.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Categories</span>
            <h2>Shop by tyre type</h2>
          </div>
          <Link to="/tyres" className="link-arrow">Browse all tyres <Icon name="chevron" size={16} /></Link>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.name} to={`/tyres?category=${encodeURIComponent(c.name)}`} className="cat-card">
              <img src={c.image} alt="" loading="lazy" className="cat-img" style={{ objectPosition: c.focus }} />
              <div className="cat-body">
                <h3>{c.name === '4x4' ? '4x4 & Ute' : c.name}</h3>
                <p>{c.blurb}</p>
                <span className="link-arrow">Shop now <Icon name="chevron" size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Limited time</span>
              <h2>Hot tyre deals</h2>
            </div>
            <Link to="/tyres?onSale=true" className="link-arrow">View all deals <Icon name="chevron" size={16} /></Link>
          </div>
          <div className="product-grid">
            {deals.map((t) => <TyreCard key={t.id} tyre={t} />)}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Trusted names</span>
            <h2>Shop by brand</h2>
          </div>
          <Link to="/brands" className="link-arrow">All brands <Icon name="chevron" size={16} /></Link>
        </div>
        <div className="brand-strip">
          {brands.map((b) => (
            <Link key={b.id} to={`/tyres?brand=${b.id}`} className="brand-pill" style={{ '--brand': b.color }}>
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">How it works</span>
            <h2>Fitted in three simple steps</h2>
            <p>From search to driving away, usually in under an hour.</p>
          </div>
          <div className="steps">
            <div className="step"><span>1</span><h3>Find your tyres</h3><p>Search by vehicle or size and compare price, ratings and warranty.</p></div>
            <div className="step"><span>2</span><h3>Book a fitting</h3><p>Choose a store or mobile fitting and pick a time that suits you.</p></div>
            <div className="step"><span>3</span><h3>Drive away</h3><p>We fit, balance and check your car. Pay on the day, no surprises.</p></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Car services</span>
            <h2>More than just tyres</h2>
          </div>
          <Link to="/services" className="link-arrow">Book a service <Icon name="chevron" size={16} /></Link>
        </div>
        <div className="service-teaser">
          {[
            ['align', 'Wheel alignment', 'from $89'],
            ['balance', 'Wheel balancing', 'from $59'],
            ['puncture', 'Puncture repair', 'from $45'],
            ['brake', 'Brake check', 'Free'],
            ['battery', 'Battery test', 'Free'],
          ].map(([icon, name, price]) => (
            <Link key={name} to="/services" className="service-mini">
              <Icon name={icon} size={30} />
              <strong>{name}</strong>
              <span>{price}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">Reviews</span>
            <h2>Rated 4.8/5 by 12,000+ drivers</h2>
            <p>Real feedback from customers across Australia.</p>
          </div>
          <div className="reviews">
            {reviews.map((r) => (
              <blockquote key={r.name} className="review card">
                <div className="review-stars">★★★★★</div>
                <p>“{r.text}”</p>
                <footer>
                  <span className="avatar" aria-hidden="true">{r.name[0]}</span>
                  <div><strong>{r.name}</strong><span className="muted">{r.where}</span></div>
                  <span className="verified"><Icon name="check" size={14} /> Verified</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section container" id="size-guide">
        <div className="size-guide card">
          <div>
            <span className="eyebrow">Size guide</span>
            <h2>How to read your tyre size</h2>
            <p className="muted">You'll find it printed on the sidewall of your tyre.</p>
            <dl className="size-legend">
              <div><dt>205</dt><dd>Width in millimetres</dd></div>
              <div><dt>55</dt><dd>Profile: sidewall height as a % of width</dd></div>
              <div><dt>R</dt><dd>Radial construction</dd></div>
              <div><dt>16</dt><dd>Rim diameter in inches</dd></div>
              <div><dt>91V</dt><dd>Load index &amp; speed rating</dd></div>
            </dl>
          </div>
          <div className="size-demo" aria-hidden="true">
            <span className="w">205</span>/<span className="p">55</span><span className="r">R</span><span className="d">16</span> <span className="l">91V</span>
          </div>
        </div>
      </section>

      <section className="section container narrow" id="faq">
        <div className="section-title">
          <span className="eyebrow">FAQ</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
