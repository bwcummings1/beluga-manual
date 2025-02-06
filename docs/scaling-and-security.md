# Beluga Scaling and Security Guide

This document outlines strategies for scaling the Beluga application and implementing security measures for a production environment.

## Scaling Strategies

### 1. Horizontal Scaling

Horizontal scaling involves adding more instances of your services to distribute the load.

#### Next.js Application:
- Use a load balancer (e.g., Nginx, HAProxy) to distribute traffic across multiple Next.js instances.
- Update your docker-compose.yml to support multiple replicas:

```yaml
services:
  nextjs-app:
    deploy:
      replicas: 3

```