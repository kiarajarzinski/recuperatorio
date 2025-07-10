import express from 'express';
import dotenv from 'dotenv';
import {Sequelize} from 'sequelize';
//Cargar variables de entorno
dotenv.config();
//crea una instancia de Sequelize 
export const sequelize = new Sequelize(
    process.env.DB_NAME ,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql', // Por defecto, usa MySQL
        logging: false, // Desactiva el logging de SQL
    }
)
//verifica la conexion a la base de datos 
sequelize.authenticate()
    .then(() => {
        console.log('conexion a la base de datos exitosa');
    })
    .catch(err => {
        console.error('no se pudo conectar a la base de datos:', err);
        process.exit(1);
    })