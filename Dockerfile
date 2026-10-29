# syntax=docker/dockerfile:1

# ---------- Base: dependencias ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---------- Desarrollo: Vite con hot-reload ----------
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "5173"]

# ---------- Build de producción ----------
FROM deps AS build
COPY . .
RUN yarn build

# ---------- Producción: nginx sirviendo estáticos ----------
FROM nginx:1.27-alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
