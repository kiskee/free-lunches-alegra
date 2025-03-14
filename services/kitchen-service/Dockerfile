FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Crear endpoint de salud
RUN echo 'app.get("/health", (req, res) => { res.status(200).send("OK"); });' >> src/server.js

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

CMD ["node", "src/server.js"]