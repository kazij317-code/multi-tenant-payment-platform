# 1. Build Stage
FROM node:20-alpine AS builder

# Alpine Linux-এর জন্য OpenSSL ইনস্টল করা যাতে প্রিজমা কাজ করতে পারে
RUN apk add --no-cache openssl

WORKDIR /usr/src/app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
WORKDIR /usr/src/app/apps/api
RUN npm install
COPY apps/api ./
RUN npx prisma generate
RUN npm run build

# 2. Production Stage
FROM node:20-alpine AS runner

# প্রোডাকশন স্টেপেও ওপেনএসএল যুক্ত করা
RUN apk add --no-cache openssl

WORKDIR /usr/src/app/apps/api
ENV NODE_ENV=production

COPY package*.json ./
COPY apps/api/package*.json ./
# প্রোডাকশনে আলাদা করে npm install না চালিয়ে builder থেকে node_modules, dist এবং prisma কপি করা হচ্ছে
COPY --from=builder /usr/src/app/apps/api/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/apps/api/prisma ./prisma

EXPOSE 5000
CMD ["npm", "run", "start:prod"]