// src/components/checkout.jsx
import React, { useState } from "react";

const Checkout = ({ cart, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Por favor completá todos los campos.");
      return;
    }

    try {
      // Armamos el payload con los datos del comprador y los productos del carrito
      const payload = {
        buyer: formData,
        products: cart, // asumimos que cart es un array de productos con cantidad
        date: new Date().toLocaleString(),
      };

      // Enviamos al backend
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Compra realizada con éxito!");
        // Llamamos al callback para mostrar resumen en Brief
        onConfirm(payload);
      } else {
        alert("Ocurrió un error al procesar la compra");
      }
    } catch (error) {
      console.error("Error enviando la orden:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Finalizar compra 🛒</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Finalizar compra
        </button>
      </form>
    </div>
  );
};

// --- ESTILOS EN LÍNEA ---
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Checkout;
