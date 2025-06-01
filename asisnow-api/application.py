from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# URLs de las APIs externas
API_SUPABASE = "https://ypucwjnulpdbifwgyzhn.supabase.co/rest/v1"
API_KEY_SUPABASE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdWN3am51bHBkYmlmd2d5emhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjY5MDMsImV4cCI6MjA2MzQ0MjkwM30.fBrI7fC2bmGXW3yXmQV-dp6krxCMS1bmOcWqk4Gxod8"
API_OUC = "https://services9.arcgis.com/kKJR3Qt68ohAWuet/arcgis/rest/services/Estaciones_actuales_y_proyectadas_de_Metro_de_Santiago/FeatureServer/0/query?where=1%3D1&outFields=nombre,linea,estacion&outSR=4326&f=json"

@app.route('/')
def root():
    return "root"

# para pruebas de la API
@app.route('/users', methods=['GET'])
def get_users():
  return jsonify([
        {'id': 546, 'username': 'John'},
        {'id': 894, 'username': 'Mary'},
        {'id': 326, 'username': 'Jane'}
    ])
# API para obtener datos de Supabase HAY QUE ARREGLAR ESTO
@app.route('/api/supabase', methods=['GET'])
def get_supabase():
    headers = {
        "apikey": API_KEY_SUPABASE,
        "Authorization": f"Bearer {API_KEY_SUPABASE}"
    }
    try:
        response = requests.get(API_SUPABASE, headers=headers)
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