// src/app.ts
import express, { Request, Response } from 'express';
// Importa PrismaClient desde la ruta de salida que definiste en schema.prisma
import { PrismaClient } from '../src/generated/prisma'; // <-- Ruta corregida

// Inicializa Prisma Client
const prisma = new PrismaClient();

// Inicializa Express
const app = express();

// Lee el puerto desde las variables de entorno o usa 3000 por defecto
const port = process.env.PORT || 3000;

// Middleware para parsear JSON en el cuerpo de las peticiones
// Necesario si vas a recibir datos JSON (ej: en POST o PUT)
app.use(express.json());

// Ruta de ejemplo básica
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! API Specialy funcionando.');
});

// Ejemplo de ruta usando Prisma (¡Descomentar y adaptar cuando la necesites!)
/*
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});
*/

// Inicia el servidor
app.listen(port, () => {
  // Usar console.log es estándar en Node.js para logging
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});

// Manejo elegante del cierre de Prisma al detener la aplicación (opcional pero recomendado)
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Prisma Client desconectado.');
});