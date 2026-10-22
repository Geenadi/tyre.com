import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { api, money } from '../api.js';

const longDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.order(id).then(setOrder).catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="container page narrow center">
        <h1>Order not found</h1>
        <p className="muted">{error}</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    );
  }
  if (!order) return <div className="container page"><div className="loading">Loading…</div></div>;

  const { fitting, appointment, customer } = order;

  return (
    <div className="container page narrow">
      <div className="success-head">
        <span className="success-icon"><Icon name="check" size={36} /></span>
        <h1>Booking confirmed</h1>
        <p className="muted">
          Thanks {customer.name.split(' ')[0]}! We've sent a confirmation to <strong>{customer.email}</strong>.
        </p>
        <div className="order-ref">Order <strong>{order.id}</strong></div>
      </div>

      <div className="card order-card">
        <div className="order-grid">
          <div>
            <h3><Icon name="calendar" size={18} /> Appointment</h3>
            <p>{longDate(appointment.date)}<br />{appointment.time}</p>
          </div>
          <div>
            <h3><Icon name={fitting.type === 'store' ? 'pin' : 'truck'} size={18} /> {fitting.type === 'store' ? 'Fitting store' : 'Mobile fitting'}</h3>
            {fitting.type === 'store'
              ? <p>{fitting.store.name}<br /><span className="muted">{fitting.store.address}<br />{fitting.store.phone}</span></p>
              : <p>{fitting.address}<br /><span className="muted">Your fitter will call 30 minutes before arriving.</span></p>}
          </div>
          {order.vehicle && (
            <div>
              <h3><Icon name="car" size={18} /> Vehicle</h3>
              <p>{order.vehicle.year} {order.vehicle.make} {order.vehicle.model}</p>
            </div>
          )}
        </div>

        <h3>Items</h3>
        {order.lines.map((l) => (
          <div key={l.id} className="summary-row summary-line">
            <span>{l.qty} × {l.name} <span className="muted">{l.size}</span></span>
            <span>{money(l.lineTotal)}</span>
          </div>
        ))}
        {order.mobile > 0 && <div className="summary-row"><span>Mobile fitting</span><span>{money(order.mobile)}</span></div>}
        {order.alignment > 0 && <div className="summary-row"><span>Wheel alignment</span><span>{money(order.alignment)}</span></div>}
        <div className="summary-row summary-total"><span>Total to pay on the day</span><span>{money(order.total)}</span></div>
        <p className="hint">Includes GST of {money(order.gst)}.</p>
      </div>

      <div className="center actions-row">
        <Link to="/" className="btn btn-outline">Back to home</Link>
        <Link to="/services" className="btn btn-primary">Book another service</Link>
      </div>
    </div>
  );
}
