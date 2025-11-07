import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  setup() {
    const equipoA = ref("");
    const equipoB = ref("");
    const liga = ref("PL"); // Premier League por defecto
    const resultado = ref(null);
    const cargando = ref(false);

    const obtenerPrediccion = async () => {
      cargando.value = true;
      resultado.value = null;

      const apiBase = "https://ai-scorecast-backend.onrender.com"; // Cambia por tu URL en Render
      const url = `${apiBase}/prediccion?equipo_a=${equipoA.value}&equipo_b=${equipoB.value}&liga=${liga.value}`;

      try {
        const res = await fetch(url);
        resultado.value = await res.json();
      } catch (err) {
        resultado.value = { error: "No se pudo conectar al servidor" };
      }

      cargando.value = false;
    };

    return { equipoA, equipoB, liga, resultado, cargando, obtenerPrediccion };
  },
  template: `
    <main style="font-family:sans-serif;max-width:500px;margin:auto;padding:1em;">
      <h1>⚽ AI ScoreCast</h1>
      <input v-model="liga" placeholder="Código de liga (ej: PL, PD, SA)" style="width:100%;margin:5px 0;" />
      <input v-model="equipoA" placeholder="Equipo A" style="width:100%;margin:5px 0;" />
      <input v-model="equipoB" placeholder="Equipo B" style="width:100%;margin:5px 0;" />
      <button @click="obtenerPrediccion" :disabled="cargando" style="width:100%;padding:10px;margin:10px 0;">
        {{ cargando ? "Cargando..." : "Predecir Resultado" }}
      </button>

      <div v-if="resultado">
        <pre>{{ JSON.stringify(resultado, null, 2) }}</pre>
      </div>
    </main>
  `,
}).mount("#root");
