// src/components/brief.jsx
import React from "react";

const Brief = ({ order }) => {
  if (!order) {
    return <h2 style={styles.msg}>No hay ninguna compra realizada todavía 🛍️</h2>;
  }

  const { buyer, products, date } = order;

  const total = products.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div style={styles.container}>
      <h2>🧾 Resumen de la compra</h2>
      <div style={styles.section}>
        <h3>👤 Datos del comprador</h3>
        <p><strong>Nombre:</strong> {buyer.name}</p>
        <p><strong>Email:</strong> {buyer.email}</p>
        <p><strong>Teléfono:</strong> {buyer.phone}</p>
        <p><strong>Fecha:</strong> {date}</p>
      </div>

      <div style={styles.section}>
        <h3>🛒 Productos</h3>
        {products.map((item, i) => (
          <div key={i} style={styles.item}>
            <p><strong>{item.title || item.name}</strong></p>
            <p>Cantidad: {item.quantity || 1}</p>
            <p>Precio unitario: ${item.price}</p>
          </div>
        ))}
        <h3 style={styles.total}>💰 Total: ${total}</h3>
      </div>
    </div>
  );
};

// --- ESTILOS EN LÍNEA ---
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "20px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
  },
  item: {
    backgroundColor: "#f9f9f9",
    margin: "8px 0",
    padding: "10px",
    borderRadius: "8px",
  },
  total: {
    textAlign: "right",
    fontWeight: "bold",
  },
  msg: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default Brief;
