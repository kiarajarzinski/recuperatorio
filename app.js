import express from 'express';
import dotenv from 'dotenv';
import characterRoutes from './src/routes/character.routes.js';
import { sequelize } from './src/config/database.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/characters', characterRoutes);

// Probar conexión a la base de datos y sincronizar modelos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync(); // Sincroniza los modelos
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
})();
