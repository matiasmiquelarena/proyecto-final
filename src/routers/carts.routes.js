// src/routers/carts.routes.js
import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.redirect(`/carts/${newCart._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear carrito");
  }
});

// Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener carrito");
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);

    if (!cart || !product) return res.status(404).send("Carrito o producto no encontrado");

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) existing.quantity++;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar producto");
  }
});

// Actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const updated = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    if (!updated) return res.status(404).send("Carrito no encontrado");
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar carrito");
  }
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).send("Producto no encontrado en el carrito");

    item.quantity = quantity;
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar cantidad");
  }
});

// Eliminar un producto
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar producto");
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al vaciar carrito");
  }
});

export default router;
