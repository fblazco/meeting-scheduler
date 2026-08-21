import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB, sequelize } from './config/database';
// Import models to ensure associations are registered before sync
import './models';

const PORT = parseInt(process.env.PORT || '5001', 10);

const startServer = async () => {
  try {
    // 1. Test database connection
    await connectDB();

    // 2. Sync database schema
    const isDev = process.env.NODE_ENV !== 'production';
    await sequelize.sync({ alter: isDev });
    console.log('📦 Database schema synchronized.');

    // 3. Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 Meeting Scheduler Server is running on port ${PORT}`);
      console.log(`📡 API endpoints base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
