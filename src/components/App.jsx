// src/App.jsx
import React, { useState, useEffect } from "react";
import Checkout from "./components/checkout";
import Brief from "./components/brief";

function App() {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  // Supongamos que tenés un carrito con ID fijo para pruebas
  const cartId = "AQUI_TU_CART_ID"; // reemplazá con un _id válido de Mongo

  // 🔹 Traer carrito desde backend al cargar la app
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/carts/${cartId}`);
        const data = await res.json();
        if (data.status === "success") {
          setCart(
            data.payload.products.map(p => ({
              _id: p.product._id,
              title: p.product.name,
              price: p.product.price,
              quantity: p.quantity,
            }))
          );
        }
      } catch (error) {
        console.error("Error cargando el carrito:", error);
      }
    };
    fetchCart();
  }, [cartId]);

  // 📦 Cuando se confirma la compra desde Checkout
  const handleConfirm = (data) => {
    setOrder(data);
    setCart([]); // opcional: vaciar carrito luego de la compra
  };

  return (
    <div>
      {!order ? (
        <Checkout cart={cart} onConfirm={handleConfirm} />
      ) : (
        <Brief order={order} />
      )}
    </div>
  );
}

export default App;
