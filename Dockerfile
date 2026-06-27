FROM node:18-alpine
WORKDIR /app
COPY we-explore-earth/shared ./shared
COPY we-explore-earth/backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY we-explore-earth/backend .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]