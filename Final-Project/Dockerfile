FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

ARG PRISMA_DATABASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STREAM_API_KEY

ENV PRISMA_DATABASE_URL="postgres://e46becbb651d65c974d9d880d98264d8f6814b3d1ef3ad150f411e0698cd74df:sk_X8aV9xoETf-ucsWkdiWyt@db.prisma.io:5432/postgres?sslmode=require"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_d2FybS1yYXR0bGVyLTU1LmNsZXJrLmFjY291bnRzLmRldiQ"
ENV NEXT_PUBLIC_STREAM_API_KEY="xs4acedg9xue"


COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]