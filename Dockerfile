# Build stage
FROM node:24-alpine AS build
RUN npm install -g pnpm@11 && apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files and workspace configuration
COPY package*.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contest-api/package.json ./packages/contest-api/
COPY packages/contest-ui/package.json ./packages/contest-ui/

# Install dependencies (including devDependencies needed for build)
RUN CI=true pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application. The output is self-contained and the runtime stage does
# not include node_modules: adapter-node bundles devDependencies into the build but
# leaves `dependencies` as runtime imports. Any package the server code imports
# (e.g. video.js, @monaco-editor/loader) must therefore be a devDependency.
RUN pnpm run build

# Runtime stage
FROM node:24-alpine
RUN apk add --no-cache tini

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S svelte -u 1001 -G nodejs

WORKDIR /app

# Copy only the build output
COPY --from=build --chown=svelte:nodejs /app/build ./build
COPY --from=build --chown=svelte:nodejs /app/package.json ./

USER svelte

# Set runtime environment variables
ENV NODE_ENV=production
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
