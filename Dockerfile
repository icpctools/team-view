# Use Node.js LTS as base image
FROM node:22-alpine
RUN npm install -g pnpm && apk add --no-cache tini git

# Set working directory
WORKDIR /app

# Copy package files and workspace configuration
COPY package*.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contest-api/package.json ./packages/contest-api/
COPY packages/contest-ui/package.json ./packages/contest-ui/

# Install dependencies (including devDependencies needed for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (before setting NODE_ENV=production)
RUN pnpm run build

# Set runtime environment variables
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S svelte -u 1001
RUN chown -R svelte:nodejs /app
USER svelte

# Set runtime environment variables
ENV PORT=3000
ENV HOST=0.0.0.0
ENV CONTEST_URL=https://localhost:8443/api/
ENV CONTEST_USER=admin
ENV CONTEST_PASSWORD=adm1n

# Expose the configurable port
EXPOSE $PORT

# Run the application with tini as init
ENTRYPOINT ["tini", "--"]
CMD ["node", "build"]