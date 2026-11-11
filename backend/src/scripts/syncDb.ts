/**
 * One-off schema sync against the database in DATABASE_URL (e.g. production on Neon).
 * Usage:
 *   npm run db:sync            -> creates missing tables only
 *   npm run db:sync -- --alter -> also alters existing tables to match the models
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDB, sequelize } from '../config/database';
import '../models';

const alter = process.argv.includes('--alter');

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter });
    console.log(`📦 Schema synced${alter ? ' (alter)' : ''}.`);
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
