Guía para Crear Entorno Virtual y Ejecutar API Flask

Para poder utilizar esta aplicación, antes que nada es necesario tener instalado lo siguiente:
- Python 3.8+ (para Flask).
- Node.js y npm (para Ionic/Angular).
- Git (para clonar el repositorio).

Lo siguiente es clonar el repositorio:
git clone https://github.com/fgaete94/asis_now.git
cd asis_now

Paso 1: Crear el Entorno Virtual para API de Flask

1. Abre la Terminal o Símbolo del Sistema y navega a la carpeta raíz del proyecto de Flask (donde se encuentra el archivo application.py):
cd …/GitHub/asis_now/asisnow-api/

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

La API se ejecutará en `http://127.0.0.1:5000/` por defecto.
En caso que el puerto no pueda ser utilizado, revisar las notas al final.


Paso 3: Ejecutar Ambos Proyectos

1. Ejecuta la Aplicación de Angular:
Abre otra terminal nueva y navega a la carpeta del proyecto Angular `cd …/GitHub/asis_now/`.
Nota: Si no tienes instalado las dependencias de Node.js, ejecuta el comando (npm install) en tu terminal.

Luego ejecuta:
ionic serve

En ese momento, se abrirá el navegador web a la url `http://localhost:8100`
Para visualizar la página en modo dispositivo móvil, sigue los siguientes pasos:

* Chrome/Edge: Presiona F12 o Ctrl + Shift + I (Windows/Linux) / Cmd + Opt + I (Mac) para abrir las herramientas de desarrollo.
- Haz clic en el ícono de dispositivo móvil en la barra superior.
- Elige un modelo de celular (ej: iPhone SE, Pixel 7) o define dimensiones personalizadas.

* Firefox: Presiona Ctrl + Shift + M (Windows/Linux) / Cmd + Opt + M (Mac).
- Selecciona un dispositivo o ajusta el tamaño manualmente.


¡AHORA PUEDES NAVEGAR POR LA APLICACIÓN!


NOTA: Solución para el error "Puerto 5000 ocupado"

1. Cambiar el puerto en el backend
- Edita el archivo `asisnow-api/application.py`.
- Reemplaza la última línea por: app.run(host='0.0.0.0', port=5001, debug=True) u otro puerto que no esté siendo utilizado

2. Actualizar el frontend
- Modifica `asisnow-app/src/environments/environment.ts` y cambia `API_URL` a: "http://localhost:5001/api" (o el número de puerto que estés utilizando)
