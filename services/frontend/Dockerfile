FROM node:18-alpine

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa Vite por defecto (5173)
EXPOSE 5173

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]