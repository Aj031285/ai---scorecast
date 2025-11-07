from flask import Flask, jsonify, request
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("FOOTBALL_DATA_API_KEY", "TU_API_KEY_AQUI")
BASE_URL = "https://api.football-data.org/v4"

@app.route("/")
def home():
    return jsonify({"message": "AI ScoreCast Backend activo 🚀"})

@app.route("/prediccion", methods=["GET"])
def prediccion():
    equipo_a = request.args.get("equipo_a")
    equipo_b = request.args.get("equipo_b")
    liga = request.args.get("liga")

    if not equipo_a or not equipo_b or not liga:
        return jsonify({"error": "Faltan parámetros"}), 400

    headers = {"X-Auth-Token": API_KEY}

    try:
        response = requests.get(f"{BASE_URL}/competitions/{liga}/standings", headers=headers)
        data = response.json()

        tabla = data["standings"][0]["table"]
        pos_a = next((t["position"] for t in tabla if equipo_a.lower() in t["team"]["name"].lower()), None)
        pos_b = next((t["position"] for t in tabla if equipo_b.lower() in t["team"]["name"].lower()), None)

        if pos_a is None or pos_b is None:
            return jsonify({"error": "No se encontraron los equipos"}), 404

        ganador = equipo_a if pos_a < pos_b else equipo_b
        return jsonify({
            "equipo_a": equipo_a,
            "equipo_b": equipo_b,
            "liga": liga,
            "pos_a": pos_a,
            "pos_b": pos_b,
            "prediccion": f"Probablemente gane {ganador}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
