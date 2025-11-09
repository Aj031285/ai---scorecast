import React, { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("Cargando conexión con el backend...");

  useEffect(() => {
    // URL pública de tu backend en Render
    fetch("https://ai-scorecast-backend.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setMensaje(data.message || "Conexión exitosa con el backend ✅");
      })
      .catch((err) => {
        console.error(err);
        setMensaje("❌ Error al conectar con el backend");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>AI ScoreCast ⚽</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
