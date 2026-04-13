# Stage 1: Build stage (not really needed, but future‑proof)
FROM node:20-slim AS build
WORKDIR /app
COPY . .

# Stage 2: Nginx static server
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy client files to nginx html directory
COPY --from=build /app /usr/share/nginx/html

# Expose port 4000 (your chosen client port)
EXPOSE 4000

# Replace default nginx config to listen on port 4000
RUN sed -i 's/listen       80;/listen       4000;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
