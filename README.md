# tyre.com

An online tyre store. Customers can search tyres by size or vehicle, compare and filter them, add them to a cart, and book a fitting at a store or a mobile fitter. Car services can be booked too.

- **client/**: React 18 + Vite + React Router
- **server/**: Express API with a seeded catalogue, saving orders, bookings and newsletter sign-ups to a JSON file

## Getting started

Requires Node 18+.

```bash
npm run install:all

# in two terminals
npm run dev:server   # API on http://localhost:4000
npm run dev:client   # app on http://localhost:5173 (proxies /api to the server)
```

To run in production mode, where the API also serves the built app:

```bash
npm run build
npm start            # http://localhost:4000
```

Run the API tests with `npm test`.

## Features

| Page | What it does |
| --- | --- |
| Home | Search by size (the width/profile/rim dropdowns narrow to sizes that exist) or by vehicle (make → model → year → factory sizes); deals, categories, brands, FAQ, size guide |
| `/tyres` | Results with facet filters (type, terrain, brand, price, stock, sale) and sorting. All filter state lives in the URL, so links can be shared |
| `/tyres/:id` | Product detail: other sizes of the same pattern, quantity, stock level, specs, tyre label, alternatives in the same size |
| `/cart` | Change quantities, remove items, see the estimated total. The cart is saved in `localStorage` |
| `/checkout` | Store or mobile fitting, optional alignment, appointment, contact details. The server prices the order live |
| `/order/:id` | Booking confirmation |
| `/services` | Book one or more services at a store |
| `/stores` | Store finder with state filter and search |
| `/brands` | Brands grouped by tier |

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/tyres` | `width, profile, rim, size, brand, category, terrain, q, minPrice, maxPrice, onSale, inStock, sort`. List filters take comma-separated values |
| GET | `/api/tyres/:id` | Includes `alternatives` and `otherSizes` |
| GET | `/api/sizes` | `width, profile` narrow the options |
| GET | `/api/brands`, `/api/stores`, `/api/services`, `/api/config` | |
| GET | `/api/vehicles/makes \| models \| years \| sizes` | |
| POST | `/api/orders/quote` | Prices a cart without saving it |
| POST | `/api/orders` | Validates the order, re-prices it on the server, reserves stock. Returns `422` with `fieldErrors` |
| GET | `/api/orders/:id` | |
| POST | `/api/bookings`, `/api/newsletter` | |

Prices and totals always come from the server catalogue. Prices sent by the client are ignored.
