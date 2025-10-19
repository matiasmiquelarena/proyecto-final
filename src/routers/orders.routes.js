// src/routers/orders.routes.js
import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const order = req.body;
  console.log("Nueva orden recibida:", order);
  // Aquí podrías guardar en Mongo si quisieras
  res.json({ status: "success", message: "Orden recibida", payload: order });
});

export default router;
