import express from "express"
import promBundle from "express-prom-bundle"
import { register } from "prom-client"
import { apiRoutes } from "./routes"
import winston from "winston"
import { createClient } from "redis"
import { Pool } from "pg"
import compression from "compression"

const app = express()
const PORT = process.env.PORT || 4000

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: "api.log" })],
})

// Prometheus middleware
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: "beluga_api" },
  promClient: {
    collectDefaultMetrics: {
      app: "beluga_api",
    },
  },
})

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on("error", (err) => logger.error("Redis Client Error", err))

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
})

app.use(metricsMiddleware)
app.use(express.json())
app.use(compression()) // Add compression middleware

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })
  next()
})

// Caching middleware
const cache = async (req, res, next) => {
  const key = `__express__${req.originalUrl || req.url}`
  const cachedBody = await redisClient.get(key)
  if (cachedBody) {
    res.send(JSON.parse(cachedBody))
    return
  }
  res.sendResponse = res.send
  res.send = (body) => {
    redisClient.set(key, JSON.stringify(body), {
      EX: 10, // Cache for 10 seconds
    })
    res.sendResponse(body)
  }
  next()
}

// API routes
app.use("/api", cache, apiRoutes)

// Metrics endpoint
app.get("/metrics", (req, res) => {
  res.set("Content-Type", register.contentType)
  res.end(register.metrics())
})

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack)
  res.status(500).send("Something broke!")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server")
  redisClient.quit()
  pool.end()
  app.close(() => {
    logger.info("HTTP server closed")
  })
})

export { app, redisClient, pool }

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
  })
}

