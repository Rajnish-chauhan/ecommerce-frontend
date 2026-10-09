# Stage 1: Build React static assets with Node.js
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve production build using lightweight Nginx Alpine
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx HTML files
RUN rm -rf ./*

# Copy built frontend assets from Vite (dist folder)
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]