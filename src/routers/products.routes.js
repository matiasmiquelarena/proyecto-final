// src/routers/products.routes.js
import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// GET con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      // Permite buscar por categoría o disponibilidad (status)
      filter = {
        $or: [
          { category: { $regex: query, $options: "i" } },
          { status: query === "true" }
        ]
      };
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
    };

    const result = await Product.paginate ? 
      await Product.paginate(filter, options) : 
      await Product.find(filter).sort(options.sort).limit(options.limit);

    // Si no usás mongoose-paginate, hacemos manual el formato:
    const products = await Product.find(filter)
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / options.limit);

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: options.page > 1 ? options.page - 1 : null,
      nextPage: options.page < totalPages ? options.page + 1 : null,
      page: options.page,
      hasPrevPage: options.page > 1,
      hasNextPage: options.page < totalPages,
      prevLink: options.page > 1 ? `/api/products?page=${options.page - 1}` : null,
      nextLink: options.page < totalPages ? `/api/products?page=${options.page + 1}` : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al obtener productos" });
  }
});

// POST nuevo producto
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

export default router;
