# Étape 1 : Construction de l'application
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Servir l'application avec nginx
FROM nginx:alpine

# Copier les fichiers construits
COPY --from=builder /app/build /usr/share/nginx/html

# Configuration nginx simple
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
