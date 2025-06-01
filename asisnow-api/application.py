from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# URLs de las APIs externas
API_SUPABASE = "https://ypucwjnulpdbifwgyzhn.supabase.co/rest/v1"
API_KEY_SUPABASE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdWN3am51bHBkYmlmd2d5emhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjY5MDMsImV4cCI6MjA2MzQ0MjkwM30.fBrI7fC2bmGXW3yXmQV-dp6krxCMS1bmOcWqk4Gxod8"
API_OUC = "https://services9.arcgis.com/kKJR3Qt68ohAWuet/arcgis/rest/services/Estaciones_actuales_y_proyectadas_de_Metro_de_Santiago/FeatureServer/0/query?where=1%3D1&outFields=nombre,linea,estacion&outSR=4326&f=json"

SUPABASE_USERS_PATH = "Usuarios"

def supabase_headers():
    return {
        "apikey": API_KEY_SUPABASE,
        "Authorization": f"Bearer {API_KEY_SUPABASE}",
        "Content-Type": "application/json"
    }

@app.route('/')
def root():
    return "root"

# Obtener usuario por username (GET)
@app.route('/api/usuario/<username>', methods=['GET'])
def obtener_usuario(username):
    params = {
        "select": "*",
        "user": f"eq.{username}"
    }
    try:
        response = requests.get(
            f"{API_SUPABASE}/{SUPABASE_USERS_PATH}",
            headers=supabase_headers(),
            params=params
        )
        response.raise_for_status()
        users = response.json()
        # Filtra por rol no nulo, igual que en Angular
        filtered = [u for u in users if u.get("user") == username and u.get("rol") is not None]
        return jsonify(filtered[0] if filtered else None)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# Registrar usuario (POST)
@app.route('/api/usuario', methods=['POST'])
def registrar_usuario():
    user_data = request.json
    try:
        response = requests.post(
            f"{API_SUPABASE}/{SUPABASE_USERS_PATH}",
            headers=supabase_headers(),
            json=user_data
        )
        response.raise_for_status()
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# Logout (dummy endpoint, ya que el logout es local en el cliente)
@app.route('/api/logout', methods=['POST'])
def logout():
    # Aquí podrías invalidar un token si tuvieras autenticación real
    return jsonify({"message": "Logout (dummy endpoint)"}), 200

# Obtener todos los usuarios (GET)
@app.route('/api/usuarios', methods=['GET'])
def get_all_users():
    params = {
        "select": "*"
    }
    try:
        response = requests.get(
            f"{API_SUPABASE}/{SUPABASE_USERS_PATH}",
            headers=supabase_headers(),
            params=params
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# API para obtener estaciones filtradas por líneas específicas
@app.route('/api/estaciones', methods=['GET'])
def get_estaciones():
    try:
        respuesta = requests.get(API_OUC)
        respuesta.raise_for_status()
        data = respuesta.json()

        if 'features' in data:
            estaciones_filtradas = []
            lineas_a_buscar = ["Linea 2", "Linea 3", "Linea 6"]
            for feature in data['features']:
                attributes = feature.get('attributes', {})
                if 'linea' in attributes and attributes['linea'] in lineas_a_buscar:
                    estaciones_filtradas.append(attributes)
            return jsonify(estaciones_filtradas)
        else:
            return jsonify({'error': 'Formato de respuesta de la API externa inesperado'}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)