Guía para Crear Entorno Virtual y Ejecutar API Flask

Paso 1: Crear el Entorno Virtual para API de Flask

1. Abre la Terminal o Símbolo del Sistema y navega a la carpeta raíz del proyecto de Flask (donde se encuentra el archivo application.py):
cd …/app_asistencia/asis_now/asisnow-api/

2. Crea el Entorno Virtual usando el módulo venv:
python -m venv venv

3. Activa el Entorno Virtual:
•	En Windows:
.\venv\Scripts\activate
•	En macOS/Linux:
source venv/bin/activate

4. Instala Flask y otras dependencias:
pip install flask
pip install flask-cors

En el archivo requirements.txt:
pip install -r requirements.txt

Al terminar de utilizar la aplicación, puedes desactivar el Entorno Virtual (opcional):
deactivate

Paso 2: Probar tu API de Flask
Para permitir que el frontend (Angular) y backend (Flask) interactúen correctamente, instala flask_cors:
pip install Flask-Cors

Ejecuta la API de Flask con el entorno virtual activo:
python application.py

La API se ejecutará en http://127.0.0.1:5000/ por defecto.

Paso 3: Ejecutar Ambos Proyectos

1. Ejecuta la Aplicación de Angular:
Abre otra terminal nueva y navega a la carpeta del proyecto Angular. Luego ejecuta:
ionic serve
