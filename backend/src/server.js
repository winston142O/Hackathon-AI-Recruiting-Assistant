// Módulos y dependencias
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

// Cargar variables de entorno
dotenv.config();

const app = express(); // Inicializar Express

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Add a simple logging middleware
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} ] ${new Date()}`);
    next();
});

// Conectar a MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error de conexión:", err));

// Rutas
const jobRoutes = require("./routes/jobRoutes");
app.use("/jobs", jobRoutes);

app.get("/", (req, res) => {
    res.send("API con Express y MongoDB en HTTP 🚀");
});

// Levantar servidor en un puerto local (por defecto 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
});
