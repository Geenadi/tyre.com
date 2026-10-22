import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Field from '../components/Field.jsx';
import AppointmentPicker from '../components/AppointmentPicker.jsx';
import Icon from '../components/Icon.jsx';
import { api, money } from '../api.js';

const priceLabel = (p) => (p === 0 ? 'Free' : money(p));

export default function Services() {
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [stores, setStores] = useState([]);
  const [chosen, setChosen] = useState(() => (params.get('service') ? [params.get('service')] : []));
  const [storeId, setStoreId] = useState(params.get('store') || '');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [appointment, setAppointment] = useState({ date: '', time: '' });
  const [rego, setRego] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.services().then(setServices).catch(() => {});
    api.stores().then(setStores).catch(() => {});
  }, []);

  const toggle = (id) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const estimate = services.filter((s) => chosen.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const minutes = services.filter((s) => chosen.includes(s.id)).reduce((sum, s) => sum + s.duration, 0);
  const setC = (k) => (e) => setCustomer({ ...customer, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);
    try {
      setBooking(await api.book({ serviceIds: chosen, storeId, customer, appointment, rego, notes }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrors(err.fieldErrors);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (booking) {
    return (
      <div className="container page narrow">
        <div className="success-head">
          <span className="success-icon"><Icon name="check" size={36} /></span>
          <h1>Service booked</h1>
          <p className="muted">Reference <strong>{booking.id}</strong>. A confirmation is on its way to {booking.customer.email}.</p>
        </div>
        <div className="card order-card">
          <div className="order-grid">
            <div>
              <h3><Icon name="calendar" size={18} /> When</h3>
              <p>{new Date(`${booking.appointment.date}T00:00:00`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}<br />{booking.appointment.time}</p>
            </div>
            <div>
              <h3><Icon name="pin" size={18} /> Where</h3>
              <p>{booking.store.name}<br /><span className="muted">{booking.store.address}</span></p>
            </div>
          </div>
          {booking.services.map((s) => (
            <div key={s.id} className="summary-row"><span>{s.name}</span><span>{priceLabel(s.price)}</span></div>
          ))}
          <div className="summary-row summary-total"><span>Estimate</span><span>{priceLabel(booking.estimate)}</span></div>
        </div>
        <div className="center actions-row">
          <Link to="/" className="btn btn-outline">Back to home</Link>
          <Link to="/tyres" className="btn btn-primary">Shop tyres</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-intro">
        <h1>Car services</h1>
        <p className="muted">Qualified technicians, transparent prices and no-obligation free checks. Book online in a minute.</p>
      </div>

      {formError && <div className="alert alert-error" role="alert">{formError}</div>}

      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="checkout-steps">
          <section className="card form-section">
            <h2><span className="step-num">1</span> Choose services</h2>
            <div className="service-grid">
              {services.map((s) => (
                <label key={s.id} className={`service-card ${chosen.includes(s.id) ? 'selected' : ''}`}>
                  <input type="checkbox" checked={chosen.includes(s.id)} onChange={() => toggle(s.id)} />
                  <Icon name={s.icon} size={30} />
                  <div>
                    <strong>{s.name}</strong>
                    <p className="muted">{s.description}</p>
                    <div className="service-meta">
                      <span className="price">{priceLabel(s.price)}</span>
                      <span className="muted"><Icon name="clock" size={14} /> {s.duration} min</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.serviceIds && <p className="error-text">{errors.serviceIds}</p>}
          </section>

          <section className="card form-section">
            <h2><span className="step-num">2</span> Store &amp; time</h2>
            <Field label="Store" error={errors.storeId}>
              <select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
                <option value="">Choose a store</option>
                {stores.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.state})</option>)}
              </select>
            </Field>
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
                <input type="tel" value={customer.phone} onChange={setC('phone')} autoComplete="tel" />
              </Field>
            </div>
            <div className="form-row">
              <Field label="Rego (optional)">
                <input value={rego} onChange={(e) => setRego(e.target.value.toUpperCase())} maxLength={9} />
              </Field>
              <Field label="Notes (optional)">
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know?" />
              </Field>
            </div>
          </section>
        </div>

        <aside className="summary card">
          <h2>Your booking</h2>
          {chosen.length === 0 && <p className="muted">No services selected yet.</p>}
          {services.filter((s) => chosen.includes(s.id)).map((s) => (
            <div key={s.id} className="summary-row"><span>{s.name}</span><span>{priceLabel(s.price)}</span></div>
          ))}
          <div className="summary-row summary-total"><span>Estimate</span><span>{priceLabel(estimate)}</span></div>
          {minutes > 0 && <p className="hint"><Icon name="clock" size={14} /> About {minutes} minutes</p>}
          <button className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Booking…' : 'Book service'}
          </button>
        </aside>
      </form>
    </div>
  );
}
