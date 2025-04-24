# Usa una imagen oficial de Node.js
FROM node:18

# Crea un directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Genera el cliente de Prisma
# Esto crea el código necesario en /app/src/generated/prisma (según tu schema.prisma)
RUN npx prisma generate

# Compila TypeScript
# El paso de build (tsc) ahora encontrará el cliente de Prisma generado
RUN npm run build

# Expone el puerto (ajustalo si usás otro)
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "run", "start"]