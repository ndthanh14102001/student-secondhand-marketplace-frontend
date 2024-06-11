FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN  npm ci
COPY . .
RUN npm run build

FROM nginx:1.18.0-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Copy config nginx
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
