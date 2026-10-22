// Tiny JSON-file store for orders, bookings and newsletter sign-ups.
// Good enough for a demo; swap for a real database in production.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
// Vercel's filesystem is read-only apart from /tmp, which is wiped whenever the function restarts.
const file = process.env.DB_FILE
  || (process.env.VERCEL ? '/tmp/tyre-db.json' : path.join(dir, '..', 'data', 'db.json'));

const empty = () => ({ orders: [], bookings: [], subscribers: [] });

function load() {
  try {
    return { ...empty(), ...JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch {
    return empty();
  }
}

let state = load();

function save() {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
}

export const db = {
  get: (collection) => state[collection],
  insert(collection, record) {
    state[collection].push(record);
    save();
    return record;
  },
  find: (collection, pred) => state[collection].find(pred),
};
