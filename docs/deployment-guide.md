# Beluga Deployment and Operations Guide

This guide provides detailed instructions for deploying and operating the Beluga application in a production environment. It covers containerization, configuration management, scaling strategies, and ongoing maintenance.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Containerization](#containerization)
3. [Configuration Management](#configuration-management)
4. [Docker Compose Setup](#docker-compose-setup)
5. [Production Deployment Checklist](#production-deployment-checklist)
6. [Scaling Strategies](#scaling-strategies)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Backup and Disaster Recovery](#backup-and-disaster-recovery)
9. [Updating and Maintenance](#updating-and-maintenance)

## Prerequisites

Before deploying Beluga, ensure you have the following:

- Docker (version 20.10 or later)
- Docker Compose (version 1.29 or later)
- Access to a container registry (e.g., Docker Hub, Google Container Registry)
- A domain name and SSL certificates for HTTPS
- Access to cloud resources (e.g., AWS, Google Cloud, Azure)

## Containerization

Beluga uses Docker containers for consistent deployment across different environments. Here are the Dockerfiles for each component:

### Frontend (Next.js)

```dockerfile file="Dockerfile.frontend"
# Stage 1: Building the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Running the Next.js application
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Copy necessary files from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
