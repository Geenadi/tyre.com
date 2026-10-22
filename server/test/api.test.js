import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';

process.env.DB_FILE = path.join(os.tmpdir(), `tyre-test-${process.pid}.json`);
const { app } = await import('../src/app.js');

let server, base;
before(() => new Promise((r) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}/api`; r(); }); }));
after(() => server.close());

const get = (p) => fetch(base + p).then((r) => r.json());
const post = (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const nextWeekday = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

test('filters tyres by size and sorts by price', async () => {
  const { items, total } = await get('/tyres?width=205&profile=55&rim=16&sort=price-asc');
  assert.ok(total > 0);
  assert.ok(items.every((t) => t.size === '205/55R16'));
  for (let i = 1; i < items.length; i++) assert.ok(items[i - 1].price <= items[i].price);
});

test('size dropdowns narrow as selections are made', async () => {
  const all = await get('/sizes');
  const narrowed = await get('/sizes?width=265');
  assert.ok(narrowed.profiles.length < all.profiles.length);
  assert.deepEqual(narrowed.profiles, [65, 70]);
});

test('vehicle lookup returns fitment sizes', async () => {
  const v = await get('/vehicles/sizes?make=Toyota&model=HiLux&year=2020');
  assert.deepEqual(v.sizes, ['265/65R17', '265/70R16']);
});

test('order totals are computed server-side', async () => {
  const { items } = await get('/tyres?size=225/45R17&inStock=true');
  const tyre = items[0];
  const res = await post('/orders', {
    items: [{ id: tyre.id, qty: 4, unitPrice: 1 }],
    customer: { name: 'Test User', email: 'test@example.com', phone: '0400 000 000' },
    fitting: { type: 'mobile', address: '1 Test St, Sydney' },
    appointment: { date: nextWeekday(), time: '09:00' },
    addAlignment: true,
  });
  assert.equal(res.status, 201);
  const order = await res.json();
  assert.equal(order.subtotal, Math.round(tyre.price * 4 * 100) / 100);
  assert.equal(order.total, Math.round((order.subtotal + 49 + 89) * 100) / 100);
  const fetched = await get(`/orders/${order.id}`);
  assert.equal(fetched.id, order.id);
});

test('order validation reports field errors', async () => {
  const res = await post('/orders', { items: [{ id: 'x', qty: 1 }], customer: { email: 'bad' }, fitting: {}, appointment: {} });
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.ok(body.fieldErrors.email && body.fieldErrors.name && body.fieldErrors.date && body.fieldErrors.fitting);
});

test('service booking succeeds', async () => {
  const res = await post('/bookings', {
    serviceIds: ['alignment', 'balance'],
    storeId: 'syd-cbd',
    customer: { name: 'Test User', email: 'test@example.com', phone: '0400 000 000' },
    appointment: { date: nextWeekday(), time: '10:00' },
  });
  assert.equal(res.status, 201);
  assert.equal((await res.json()).estimate, 148);
});

test('brand facet counts match the results for the other active filters', async () => {
  const { facets } = await get('/tyres?onSale=true&inStock=true');
  for (const f of facets.brands) {
    const { total } = await get(`/tyres?onSale=true&inStock=true&brand=${f.value}`);
    assert.equal(f.count, total, `${f.value} facet says ${f.count}, results show ${total}`);
  }
});

test('a facet ignores its own selection so other options keep their counts', async () => {
  const all = await get('/tyres');
  const picked = await get('/tyres?brand=michelin');
  assert.deepEqual(picked.facets.brands, all.facets.brands);
  const michelin = picked.facets.categories.reduce((n, f) => n + f.count, 0);
  assert.equal(michelin, picked.total);
});

test('brand list matches the catalogue', async () => {
  const brands = await get('/brands');
  const { facets } = await get('/tyres');
  for (const b of brands) {
    assert.equal(b.count, facets.brands.find((f) => f.value === b.id).count);
    assert.ok(b.inStock <= b.count);
  }
});
