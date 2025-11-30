# Base image: Usamos Node.js versión ligera
FROM node:18-alpine AS base

# Dependencias: Instalamos librerías necesarias para Alpine Linux
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalamos dependencias
RUN npm ci

# Generamos el cliente de Prisma
RUN npx prisma generate

# Copiamos el resto del código fuente
COPY . .

# Construimos la aplicación Next.js
# Nota: Deshabilitamos el chequeo de tipos y ESLint para agilizar el build en producción
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 8. Exponemos el puerto
EXPOSE 3000

# 9. Comando para iniciar la app
CMD ["npm", "start"]