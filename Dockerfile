# Node.js ইমেজ ব্যবহার করা
FROM node:18-alpine

# ওয়ার্কিং ডিরেক্টরি সেট করা
WORKDIR /usr/src/app

# প্যাকেজ ফাইল কপি করা এবং ডিপেন্ডেন্সি ইন্সটল করা
COPY package*.json ./
RUN npm install

# প্রজেক্টের বাকি ফাইলগুলো কপি করা
COPY . .

# প্রিজমা স্কিমা জেনারেট করা
RUN npx prisma generate

# প্রোডাকশনের জন্য অ্যাপ বিল্ড করা
RUN npm run build

# পোর্ট ওপেন করা
EXPOSE 3000

# অ্যাপ স্টার্ট করার কমান্ড
CMD ["npm", "run", "start:prod"]