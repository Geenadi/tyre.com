import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import AppointmentPicker from '../components/AppointmentPicker.jsx';
import Icon from '../components/Icon.jsx';
import { api, money } from '../api.js';
import { saveOrder } from '../savedOrders.js';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { items, vehicle, clear } = useCart();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [config, setConfig] = useState({ mobileFee: 49, alignmentAddon: 89 });
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [fitting, setFitting] = useState({ type: 'store', storeId: '', address: '' });
  const [appointment, setAppointment] = useState({ date: '', time: '' });
  const [addAlignment, setAddAlignment] = useState(false);
  const [quote, setQuote] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.stores().then(setStores).catch(() => {});
    api.config().then(setConfig).catch(() => {});
  }, []);

  // Re-price on the server whenever anything that affects the total changes.
  const cartKey = items.map((i) => `${i.id}:${i.qty}`).join('|');
  useEffect(() => {
    if (!items.length) return;
    api.quote({ items: items.map(({ id, qty }) => ({ id, qty })), fitting: { type: fitting.type }, addAlignment })
      .then(setQuote)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, fitting.type, addAlignment]);

  if (!items.length) return <Navigate to="/cart" replace />;

  const setC = (k) => (e) => setCustomer({ ...customer, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);
    try {
      const order = await api.placeOrder({
        items: items.map(({ id, qty }) => ({ id, qty })),
        customer,
        fitting,
        appointment,
        addAlignment,
        vehicle,
      });
      saveOrder(order);
      clear();
      navigate(`/order/${order.id}`, { replace: true });
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const store = stores.find((s) => s.id === fitting.storeId);

  return (
    <div className="container page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/cart">Cart</Link> <Icon name="chevron" size={14} /> <span>Checkout</span>
      </nav>
      <h1>Book your fitting</h1>
      {formError && <div className="alert alert-error" role="alert">{formError}</div>}

      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="checkout-steps">
          <section className="card form-section">
            <h2><span className="step-num">1</span> How would you like your tyres fitted?</h2>
            <div className="option-cards" role="radiogroup">
              <label className={`option-card ${fitting.type === 'store' ? 'selected' : ''}`}>
                <input type="radio" name="fitting" checked={fitting.type === 'store'} onChange={() => setFitting({ ...fitting, type: 'store' })} />
                <Icon name="pin" size={26} />
                <strong>At a store</strong>
                <span className="muted">Free · included in price</span>
              </label>
              <label className={`option-card ${fitting.type === 'mobile' ? 'selected' : ''}`}>
                <input type="radio" name="fitting" checked={fitting.type === 'mobile'} onChange={() => setFitting({ ...fitting, type: 'mobile' })} />
                <Icon name="truck" size={26} />
                <strong>Mobile fitting</strong>
                <span className="muted">We come to you · {money(config.mobileFee)}</span>
              </label>
            </div>
            {errors.fitting && <p className="error-text">{errors.fitting}</p>}

            {fitting.type === 'store' ? (
              <Field label="Fitting store" error={errors.storeId}>
                <select value={fitting.storeId} onChange={(e) => setFitting({ ...fitting, storeId: e.target.value })}>
                  <option value="">Choose a store</option>
                  {['NSW', 'VIC', 'QLD', 'WA', 'SA'].map((st) => (
                    <optgroup key={st} label={st}>
                      {stores.filter((s) => s.state === st).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>
            ) : (
              <Field label="Fitting address" error={errors.address} hint="Home or work, anywhere within 30 km of a store">
                <input value={fitting.address} onChange={(e) => setFitting({ ...fitting, address: e.target.value })} placeholder="Street, suburb, postcode" autoComplete="street-address" />
              </Field>
            )}
            {store && <p className="hint"><Icon name="pin" size={14} /> {store.address} · {store.hours}</p>}

            <label className="check addon">
              <input type="checkbox" checked={addAlignment} onChange={(e) => setAddAlignment(e.target.checked)} />
              <span><strong>Add a wheel alignment</strong> for {money(config.alignmentAddon)}. Recommended with new tyres to prevent uneven wear.</span>
            </label>
          </section>

          <section className="card form-section">
            <h2><span className="step-num">2</span> Choose an appointment</h2>
            <AppointmentPicker value={appointment} onChange={setAppointment} errors={errors} />
          </section>

          <section className="card form-section">
            <h2><span className="step-num">3</span> Your details</h2>
            <Field label="Full name" error={errors.name}>
              <input value={customer.name} onChange={setC('name')} autoComplete="name" />
            </Field>
            <div className="form-row">
              <Field label="Email" error={errors.email}>
                <input type="email" value={customer.email} onChange={setC('email')} autoComplete="email" />
              </Field>
              <Field label="Mobile" error={errors.phone}>
                <input type="tel" value={customer.phone} onChange={setC('phone')} autoComplete="tel" placeholder="04xx xxx xxx" />
              </Field>
            </div>
          </section>
        </div>

        <aside className="summary card">
          <h2>Order summary</h2>
          {(quote?.lines || items.map((i) => ({ id: i.id, name: `${i.brandName} ${i.pattern}`, size: i.size, qty: i.qty, lineTotal: i.price * i.qty }))).map((l) => (
            <div key={l.id} className="summary-row summary-line">
              <span>{l.qty} × {l.name}<br /><span className="muted">{l.size}</span></span>
              <span>{money(l.lineTotal)}</span>
            </div>
          ))}
          {quote?.errors?.length > 0 && <div className="alert alert-error">{quote.errors.join('. ')}</div>}
          <div className="summary-row"><span>Fitting &amp; balancing</span><span className="ok-text">Included</span></div>
          {quote?.mobile > 0 && <div className="summary-row"><span>Mobile fitting</span><span>{money(quote.mobile)}</span></div>}
          {quote?.alignment > 0 && <div className="summary-row"><span>Wheel alignment</span><span>{money(quote.alignment)}</span></div>}
          <div className="summary-row summary-total"><span>Total</span><span>{quote ? money(quote.total) : '…'}</span></div>
          {quote && <p className="hint">Includes GST of {money(quote.gst)}. Pay in store or to your fitter on the day.</p>}
          <button className="btn btn-primary btn-lg btn-block" disabled={submitting || quote?.errors?.length > 0}>
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
          <p className="hint center"><Icon name="shield" size={14} /> No payment is taken online</p>
        </aside>
      </form>
    </div>
  );
}
