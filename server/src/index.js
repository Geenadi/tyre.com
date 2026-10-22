import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { app } from './app.js';

const PORT = process.env.PORT || 4000;
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'client', 'dist');

// In production the API also serves the built React app.
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`tyre.com API listening on http://localhost:${PORT}`));
