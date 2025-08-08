// Siempre cargar variables de entorno antes de cualquier operación todo idiota
const express = require("express"); // Importar Express para crear la aplicación web
const mongoose = require("mongoose"); // Importar Mongoose para interactuar con MongoDB
const dotenv = require("dotenv"); // Importar dotenv para cargar variables de entorno
// Cargar variables de entorno antes de cualquier operación
dotenv.config();

const cors = require("cors"); // Importar cors para permitir solicitudes desde otros dominios
const authRoutes = require("./routes/auth.js"); // Importar rutas de autenticación
const protectedRoutes = require("./routes/protected.js"); // Importar rutas protegidas
const adminRoutes = require("./routes/admin.js"); // Importar rutas de admin
const connection = require('./config/db.js'); // Importar la función de conexión a la base de datos
connection();
const app = express();
const dessertsRoutes = require('./routes/desserts.js');

app.use(cors()); // Permitir solicitudes desde otros dominios
app.use(express.json()); // Parsear solicitudes JSON
app.use("/api/auth", authRoutes); // Usar las rutas de autenticación
app.use("/api/protected", protectedRoutes); // Usar las rutas protegidas
app.use("/api/admin", adminRoutes); // Usar las rutas de admin
app.use('/api/desserts', dessertsRoutes);

const PORT = process.env.PORT || 5000; // Obtener el puerto de las variables de entorno o usar el puerto 5000 por defecto
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`)); // Iniciar el servidor en el puerto especificado

// RUTAS QUE NO EXISTEN
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada')
})