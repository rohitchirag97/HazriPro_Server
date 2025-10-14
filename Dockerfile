FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --only=production

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json .
COPY package-lock.json .

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/v1/health/simple', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]