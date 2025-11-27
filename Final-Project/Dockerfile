FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

ARG PRISMA_DATABASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STREAM_API_KEY

ENV NEXT_PUBLIC_STREAM_BASE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_d2FybS1yYXR0bGVyLTU1LmNsZXJrLmFjY291bnRzLmRldiQ"
ENV NEXT_PUBLIC_STREAM_API_KEY="xs4acedg9xue"


COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]