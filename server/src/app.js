import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { brands, tyres, sizes, vehicles, stores, services, FITTING } from './data.js';
import { db } from './db.js';

export const app = express();
app.use(cors());
app.use(express.json());

const uniqSorted = (arr) => [...new Set(arr)].sort((a, b) => a - b);
const newId = (prefix) => `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
const round2 = (n) => Math.round(n * 100) / 100;

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/brands', (_req, res) => {
  res.json(
    brands.map((b) => ({ ...b, count: tyres.filter((t) => t.brand === b.id).length }))
  );
});

// Options for the width / profile / rim dropdowns. Each list narrows based on
// what's already selected so customers can't pick a size that doesn't exist.
app.get('/api/sizes', (req, res) => {
  const { width, profile } = req.query;
  const w = sizes;
  const p = width ? w.filter((s) => s.width === Number(width)) : w;
  const r = profile ? p.filter((s) => s.profile === Number(profile)) : p;
  res.json({
    widths: uniqSorted(w.map((s) => s.width)),
    profiles: uniqSorted(p.map((s) => s.profile)),
    rims: uniqSorted(r.map((s) => s.rim)),
  });
});

app.get('/api/tyres', (req, res) => {
  const { width, profile, rim, size, brand, category, terrain, q, minPrice, maxPrice, onSale, inStock, sort = 'popular' } = req.query;
  const list = (v) => (v ? String(v).split(',') : null);
  const brandsSel = list(brand);
  const catSel = list(category);
  const terrainSel = list(terrain);
  const sizeSel = list(size);
  const needle = q ? String(q).toLowerCase() : null;

  let result = tyres.filter(
    (t) =>
      (!width || t.width === Number(width)) &&
      (!profile || t.profile === Number(profile)) &&
      (!rim || t.rim === Number(rim)) &&
      (!sizeSel || sizeSel.includes(t.size)) &&
      (!brandsSel || brandsSel.includes(t.brand)) &&
      (!catSel || catSel.includes(t.category)) &&
      (!terrainSel || terrainSel.includes(t.terrain)) &&
      (!minPrice || t.price >= Number(minPrice)) &&
      (!maxPrice || t.price <= Number(maxPrice)) &&
      (onSale !== 'true' || t.rrp) &&
      (inStock !== 'true' || t.stock > 0) &&
      (!needle || `${t.brandName} ${t.pattern} ${t.size} ${t.category}`.toLowerCase().includes(needle))
  );

  const sorters = {
    popular: (a, b) => b.reviews - a.reviews,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  };
  result = [...result].sort(sorters[sort] || sorters.popular);

  // Facet counts are computed on the size-filtered set so the sidebar shows
  // what's actually available for the customer's tyre size.
  const sizeScoped = tyres.filter(
    (t) =>
      (!width || t.width === Number(width)) &&
      (!profile || t.profile === Number(profile)) &&
      (!rim || t.rim === Number(rim)) &&
      (!sizeSel || sizeSel.includes(t.size))
  );
  const count = (key) =>
    Object.entries(sizeScoped.reduce((acc, t) => ({ ...acc, [t[key]]: (acc[t[key]] || 0) + 1 }), {}))
      .map(([value, n]) => ({ value, count: n }));

  res.json({
    total: result.length,
    items: result,
    facets: {
      brands: count('brand').map((f) => ({ ...f, label: brands.find((b) => b.id === f.value)?.name })),
      categories: count('category'),
      terrains: count('terrain'),
    },
  });
});

app.get('/api/tyres/:id', (req, res) => {
  const tyre = tyres.find((t) => t.id === req.params.id);
  if (!tyre) return res.status(404).json({ error: 'Tyre not found' });
  const alternatives = tyres
    .filter((t) => t.size === tyre.size && t.id !== tyre.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const otherSizes = tyres
    .filter((t) => t.pattern === tyre.pattern && t.brand === tyre.brand)
    .map((t) => ({ id: t.id, size: t.size }));
  res.json({ ...tyre, alternatives, otherSizes });
});

app.get('/api/vehicles/makes', (_req, res) => {
  res.json([...new Set(vehicles.map((v) => v.make))].sort());
});

app.get('/api/vehicles/models', (req, res) => {
  res.json(vehicles.filter((v) => v.make === req.query.make).map((v) => v.model).sort());
});

app.get('/api/vehicles/years', (req, res) => {
  const v = vehicles.find((x) => x.make === req.query.make && x.model === req.query.model);
  if (!v) return res.json([]);
  const years = [];
  for (let y = v.years[1]; y >= v.years[0]; y--) years.push(y);
  res.json(years);
});

app.get('/api/vehicles/sizes', (req, res) => {
  const { make, model, year } = req.query;
  const v = vehicles.find((x) => x.make === make && x.model === model);
  if (!v || (year && (year < v.years[0] || year > v.years[1]))) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json({ make, model, year: Number(year) || null, sizes: v.sizes });
});

app.get('/api/stores', (req, res) => {
  const { state, q } = req.query;
  const needle = q?.toLowerCase();
  res.json(
    stores.filter(
      (s) =>
        (!state || s.state === state) &&
        (!needle || `${s.name} ${s.address}`.toLowerCase().includes(needle))
    )
  );
});

app.get('/api/services', (_req, res) => res.json(services));

app.get('/api/config', (_req, res) => res.json(FITTING));

// ---------- Orders ----------

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s) => typeof s === 'string' && /^[\d\s()+-]{8,}$/.test(s);

function validateCustomer(c = {}) {
  const errors = {};
  if (!c.name || c.name.trim().length < 2) errors.name = 'Please enter your full name';
  if (!isEmail(c.email)) errors.email = 'Please enter a valid email';
  if (!isPhone(c.phone)) errors.phone = 'Please enter a valid phone number';
  return errors;
}

function validateAppointment(a = {}) {
  const errors = {};
  if (!a.date || Number.isNaN(Date.parse(a.date))) errors.date = 'Choose a date';
  else {
    const day = new Date(`${a.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) errors.date = 'Date must be today or later';
    if (day.getDay() === 0) errors.date = 'We are closed on Sundays';
  }
  if (!a.time) errors.time = 'Choose a time';
  return errors;
}

// Totals are always computed server-side from the catalogue, never trusted from the client.
export function priceOrder({ items = [], fitting = {}, addAlignment = false }) {
  const lines = [];
  const errors = [];
  for (const { id, qty } of items) {
    const tyre = tyres.find((t) => t.id === id);
    const n = Number(qty);
    if (!tyre) { errors.push(`Unknown tyre ${id}`); continue; }
    if (!Number.isInteger(n) || n < 1 || n > 8) { errors.push(`Invalid quantity for ${tyre.pattern}`); continue; }
    if (tyre.stock < n) { errors.push(`Only ${tyre.stock} of ${tyre.brandName} ${tyre.pattern} ${tyre.size} in stock`); continue; }
    lines.push({ id, name: `${tyre.brandName} ${tyre.pattern}`, size: tyre.size, qty: n, unitPrice: tyre.price, lineTotal: round2(tyre.price * n) });
  }
  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));
  const mobile = fitting.type === 'mobile' ? FITTING.mobileFee : 0;
  const alignment = addAlignment ? FITTING.alignmentAddon : 0;
  const total = round2(subtotal + mobile + alignment);
  const gst = round2(total / 11);
  return { lines, subtotal, mobile, alignment, total, gst, errors };
}

app.post('/api/orders/quote', (req, res) => {
  res.json(priceOrder(req.body));
});

app.post('/api/orders', (req, res) => {
  const { items, customer, fitting = {}, appointment, addAlignment, vehicle } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty' });
  }
  const fieldErrors = { ...validateCustomer(customer), ...validateAppointment(appointment) };
  if (fitting.type === 'store' && !stores.some((s) => s.id === fitting.storeId)) {
    fieldErrors.storeId = 'Choose a fitting store';
  } else if (fitting.type === 'mobile' && (!fitting.address || fitting.address.trim().length < 6)) {
    fieldErrors.address = 'Enter the address for mobile fitting';
  } else if (!['store', 'mobile'].includes(fitting.type)) {
    fieldErrors.fitting = 'Choose a fitting option';
  }
  if (Object.keys(fieldErrors).length) {
    return res.status(422).json({ error: 'Please fix the highlighted fields', fieldErrors });
  }

  const quote = priceOrder({ items, fitting, addAlignment });
  if (quote.errors.length) return res.status(409).json({ error: quote.errors.join('. ') });

  // Reserve stock.
  for (const l of quote.lines) tyres.find((t) => t.id === l.id).stock -= l.qty;

  const order = db.insert('orders', {
    id: newId('TC'),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    customer: { name: customer.name.trim(), email: customer.email.trim(), phone: customer.phone.trim() },
    vehicle: vehicle || null,
    fitting: fitting.type === 'store'
      ? { type: 'store', store: stores.find((s) => s.id === fitting.storeId) }
      : { type: 'mobile', address: fitting.address.trim() },
    appointment: { date: appointment.date, time: appointment.time },
    ...quote,
    errors: undefined,
  });
  res.status(201).json(order);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.find('orders', (o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// ---------- Service bookings ----------

app.post('/api/bookings', (req, res) => {
  const { serviceIds, storeId, customer, appointment, rego, notes } = req.body || {};
  const fieldErrors = { ...validateCustomer(customer), ...validateAppointment(appointment) };
  const chosen = services.filter((s) => (serviceIds || []).includes(s.id));
  if (!chosen.length) fieldErrors.serviceIds = 'Choose at least one service';
  const store = stores.find((s) => s.id === storeId);
  if (!store) fieldErrors.storeId = 'Choose a store';
  if (Object.keys(fieldErrors).length) {
    return res.status(422).json({ error: 'Please fix the highlighted fields', fieldErrors });
  }
  const booking = db.insert('bookings', {
    id: newId('BK'),
    createdAt: new Date().toISOString(),
    services: chosen,
    store,
    customer,
    appointment,
    rego: rego || null,
    notes: notes || null,
    estimate: chosen.reduce((s, x) => s + x.price, 0),
  });
  res.status(201).json(booking);
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body || {};
  if (!isEmail(email)) return res.status(422).json({ error: 'Please enter a valid email' });
  if (!db.find('subscribers', (s) => s.email === email)) {
    db.insert('subscribers', { email, createdAt: new Date().toISOString() });
  }
  res.json({ ok: true });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));
