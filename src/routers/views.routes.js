// src/routers/views.routes.js
import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = Router();

// Home
router.get("/", (req, res) => res.render("home"));

// Mostrar productos con paginación, filtros y ordenamiento
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { category: query } : {}; // Puedes ajustar para disponibilidad si querés
    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.max(parseInt(page), 1);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((currentPage - 1) * limit)
      .limit(parseInt(limit));

    res.render("products", {
      products,
      pagination: {
        totalPages,
        page: currentPage,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los productos");
  }
});

// Mostrar detalle de un producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el producto");
  }
});

// Mostrar carrito con populate
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
  }
});

export default router;

