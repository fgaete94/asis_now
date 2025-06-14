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
        print("Supabase status:", response.status_code)
        print("Supabase response:", response.text)
        response.raise_for_status()
        # Si la respuesta está vacía, devuelve un mensaje de éxito
        if not response.text.strip():
            return jsonify({"message": "Usuario creado correctamente"}), 201
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        print("Exception:", e)
        return jsonify({'error': str(e), 'details': response.text if 'response' in locals() else ''}), 500

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
            estaciones_filtradas = [
                {
                    "nombre": f["attributes"]["nombre"],
                    "linea": f["attributes"]["linea"]
                }
                for f in data["features"]
                if f["attributes"]["estacion"] == "EXISTENTE"
                and f["attributes"]["linea"] in ["Linea 2", "Linea 3", "Linea 6"]
            ]
            return jsonify(estaciones_filtradas)
        else:
            return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ubicacion', methods=['POST'])
def recibir_ubicacion():
    data = request.json
    lat = data.get('lat')
    lng = data.get('lng')
    if lat is not None and lng is not None:
        # Aquí  guardar la ubicación
        return jsonify({"lat": lat, "lng": lng}), 200
    else:
        return jsonify({"error": "Datos de ubicación incompletos"}), 400

@app.route('/api/usuario/<username>/rol', methods=['PATCH'])
def cambiar_rol_usuario(username):
    data = request.json
    nuevo_rol = data.get('rol')
    if not nuevo_rol:
        return jsonify({'error': 'Falta el campo rol'}), 400

    try:
        print("Cambiando rol de usuario", username, "a", nuevo_rol)
        response = requests.patch(
            f"{API_SUPABASE}/{SUPABASE_USERS_PATH}?user=eq.{username}",
            headers=supabase_headers(),
            json={"rol": nuevo_rol}
        )
        response.raise_for_status()
        return jsonify({"message": "Rol actualizado"}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# Registrar asistencia (POST)
@app.route('/api/Asistencia', methods=['POST'])
def registrar_asistencia():
    data = request.json
    asistencia = {
        "usuario": data.get("usuario"),
        "entrada": data.get("entrada"),
        "salida": data.get("salida"),
        "estacion": data.get("estacion"),
        "linea": data.get("linea"),
        "ubicacionUrl": data.get("ubicacionUrl")
    }
    try:
        response = requests.post(
            f"{API_SUPABASE}/Asistencia",
            headers=supabase_headers(),
            json=asistencia
        )
        print("Supabase status:", response.status_code)
        print("Supabase response:", response.text)
        response.raise_for_status()
        if not response.text.strip():
            return jsonify({"message": "Asistencia registrada correctamente"}), 201
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        print("Exception:", e)
        return jsonify({'error': str(e), 'details': response.text if 'response' in locals() else ''}), 500

@app.route('/api/Asistencia', methods=['GET'])
def obtener_asistencias():
    fecha = request.args.get('fecha')
    estacion = request.args.get('estacion')
    url = f"{API_SUPABASE}/Asistencia?select=*"
    if fecha:
        fecha_solo = fecha[:10]
        url += f"&entrada=gte.{fecha_solo}T00:00:00&entrada=lt.{fecha_solo}T23:59:59"
    if estacion:
        url += f"&estacion=eq.{estacion}"
    try:
        response = requests.get(
            url,
            headers=supabase_headers()
        )
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        print("ERROR EN SUPABASE:", e)
        print("RESPUESTA:", getattr(e.response, 'text', 'Sin respuesta'))
        return jsonify({'error': str(e), 'details': getattr(e.response, 'text', 'Sin respuesta')}), 500

@app.route('/api/Asistencia/manual', methods=['POST'])
def registrar_asistencia_manual():
    data = request.json
    asistencia = {
        "usuario": data.get("usuario"),
        "observacion": data.get("observacion")
    }
    # Si viene 'justificado', es ausencia
    if data.get("justificado"):
        asistencia["justificado"] = data.get("justificado")
    # Si viene 'entrada', es asistencia
    if data.get("entrada"):
        asistencia["entrada"] = data.get("entrada")
        asistencia["estacion"] = data.get("estacion")
    try:
        response = requests.post(
            f"{API_SUPABASE}/Asistencia",
            headers=supabase_headers(),
            json=asistencia
        )
        print("Supabase status:", response.status_code)
        print("Supabase response:", response.text)
        response.raise_for_status()
        if not response.text.strip():
            return jsonify({"message": "Asistencia manual registrada correctamente"}), 201
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        print("Exception:", e)
        return jsonify({'error': str(e), 'details': response.text if 'response' in locals() else ''}), 500

if __name__ == "__main__":
    app.run(debug=True)