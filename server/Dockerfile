# backend/Dockerfile (JS)
FROM node:20-alpine

# tạo user non-root (tốt cho security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# copy package files and install only production deps
COPY package.json package-lock.json ./
RUN npm ci --production

# copy source
COPY . .

# nếu bạn có build step (babel/ts), add RUN npm run build
# expose port (thay 4000 nếu app bạn dùng cổng khác)
EXPOSE 4000


# start app
CMD ["npm", "start"]