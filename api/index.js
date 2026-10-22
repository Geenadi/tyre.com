// Vercel entry point: the whole Express API runs as one serverless function.
// vercel.json rewrites every /api/* request here; the React app is served as static files.
import { app } from '../server/src/app.js';

export default app;
