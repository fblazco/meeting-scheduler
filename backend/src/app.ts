import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Meeting Scheduler API is running',
  });
});

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;