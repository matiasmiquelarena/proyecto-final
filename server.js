// server.js
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";

import productsRouter from "./src/routers/products.routes.js";
import cartsRouter from "./src/routers/carts.routes.js";
import viewsRouter from "./src/routers/views.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// 🧠 Conexión a MongoDB Atlas (o local)
mongoose.connect("mongodb://localhost:27017/ecommerce-entrega-final")
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch(err => console.error("🔴 Error al conectar a MongoDB:", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // <--- agregado para PUT y DELETE en formularios
app.use(express.static(path.join(__dirname, "src/public")));

// Motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "handlebars");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
