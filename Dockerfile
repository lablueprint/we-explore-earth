FROM node:18-alpine
WORKDIR /app
COPY we-explore-earth/ .
WORKDIR /app/backend
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/backend/src/index.js"]