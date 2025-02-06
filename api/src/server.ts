import express from 'express';
import promBundle from 'express-prom-bundle';
import { register } from 'prom-client';
import { apiRoutes } from './routes';
import winston from 'winston';

const app = express();
const PORT = process.env.PORT || 4000;

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'api.log' })
  ]
});

// Prometheus middleware
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: 'beluga_api' },
  promClient: {
    collectDefaultMetrics: {
      app: 'beluga_api'
    }
  }
});

app.use(metricsMiddleware);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// API routes
app.use('/api', apiRoutes);

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

