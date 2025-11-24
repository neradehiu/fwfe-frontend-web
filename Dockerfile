# ===============================
# Stage 1: Build React App
# ===============================
FROM node:20 AS build

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===============================
# Stage 2: Serve with Nginx
# ===============================
FROM nginx:alpine

# Copy build output vào thư mục Nginx
COPY --from=build /app/dist /usr/share/nginx/html/react

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx mặc định listen 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
