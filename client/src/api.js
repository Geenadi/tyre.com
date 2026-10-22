// Thin fetch wrapper. Errors carry the API's message and any per-field errors.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.fieldErrors = data.fieldErrors || {};
    throw err;
  }
  return data;
}

const qs = (params) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)).toString();
  return s ? `?${s}` : '';
};

export const api = {
  brands: () => request('/brands'),
  sizes: (params = {}) => request(`/sizes${qs(params)}`),
  tyres: (params = {}) => request(`/tyres${qs(params)}`),
  tyre: (id) => request(`/tyres/${encodeURIComponent(id)}`),
  makes: () => request('/vehicles/makes'),
  models: (make) => request(`/vehicles/models${qs({ make })}`),
  years: (make, model) => request(`/vehicles/years${qs({ make, model })}`),
  vehicleSizes: (make, model, year) => request(`/vehicles/sizes${qs({ make, model, year })}`),
  stores: (params = {}) => request(`/stores${qs(params)}`),
  services: () => request('/services'),
  config: () => request('/config'),
  quote: (body) => request('/orders/quote', { method: 'POST', body }),
  placeOrder: (body) => request('/orders', { method: 'POST', body }),
  order: (id) => request(`/orders/${encodeURIComponent(id)}`),
  book: (body) => request('/bookings', { method: 'POST', body }),
  subscribe: (email) => request('/newsletter', { method: 'POST', body: { email } }),
};

export const money = (n) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);
