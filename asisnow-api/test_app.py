import pytest
from application import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_root(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"root" in response.data

def test_get_usuario_not_found(client, monkeypatch):
    def mock_get(*args, **kwargs):
        class MockResponse:
            def raise_for_status(self): pass
            def json(self): return []
        return MockResponse()
    monkeypatch.setattr("requests.get", mock_get)
    response = client.get('/api/usuario/testuser')
    assert response.status_code == 200
    assert response.get_json() is None

def test_registrar_usuario(client, monkeypatch):
    def mock_post(*args, **kwargs):
        class MockResponse:
            status_code = 201
            text = ''
            def raise_for_status(self): pass
            def json(self): return {"user": "test"}
        return MockResponse()
    monkeypatch.setattr("requests.post", mock_post)
    response = client.post('/api/usuario', json={"user": "test"})
    assert response.status_code == 201
    assert "Usuario creado correctamente" in response.get_data(as_text=True)

def test_logout(client):
    response = client.post('/api/logout')
    assert response.status_code == 200
    assert "Logout" in response.get_data(as_text=True)

def test_get_all_users(client, monkeypatch):
    def mock_get(*args, **kwargs):
        class MockResponse:
            def raise_for_status(self): pass
            def json(self): return [{"user": "a"}, {"user": "b"}]
        return MockResponse()
    monkeypatch.setattr("requests.get", mock_get)
    response = client.get('/api/usuarios')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_get_estaciones(client, monkeypatch):
    def mock_get(*args, **kwargs):
        class MockResponse:
            def raise_for_status(self): pass
            def json(self):
                return {
                    "features": [
                        {"attributes": {"nombre": "Est1", "linea": "Linea 2", "estacion": "EXISTENTE"}},
                        {"attributes": {"nombre": "Est2", "linea": "Linea 1", "estacion": "EXISTENTE"}},
                    ]
                }
        return MockResponse()
    monkeypatch.setattr("requests.get", mock_get)
    response = client.get('/api/estaciones')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert any(est["linea"] == "Linea 2" for est in data)

def test_recibir_ubicacion_ok(client):
    response = client.post('/api/ubicacion', json={'lat': 1.23, 'lng': 4.56})
    assert response.status_code == 200
    assert response.get_json() == {'lat': 1.23, 'lng': 4.56}

def test_recibir_ubicacion_error(client):
    response = client.post('/api/ubicacion', json={'lat': 1.23})
    assert response.status_code == 400
    assert 'error' in response.get_json()

def test_cambiar_rol_usuario(client, monkeypatch):
    def mock_patch(*args, **kwargs):
        class MockResponse:
            def raise_for_status(self): pass
        return MockResponse()
    monkeypatch.setattr("requests.patch", mock_patch)
    response = client.patch('/api/usuario/testuser/rol', json={"rol": 2})
    assert response.status_code == 200
    assert "Rol actualizado" in response.get_data(as_text=True)

def test_cambiar_rol_usuario_falta_rol(client):
    response = client.patch('/api/usuario/testuser/rol', json={})
    assert response.status_code == 400
    assert "Falta el campo rol" in response.get_data(as_text=True)

def test_registrar_asistencia(client, monkeypatch):
    def mock_post(*args, **kwargs):
        class MockResponse:
            status_code = 201
            text = ''
            def raise_for_status(self): pass
            def json(self): return {"usuario": "test"}
        return MockResponse()
    monkeypatch.setattr("requests.post", mock_post)
    response = client.post('/api/Asistencia', json={"usuario": "test"})
    assert response.status_code == 201

def test_obtener_asistencias(client, monkeypatch):
    def mock_get(*args, **kwargs):
        class MockResponse:
            def raise_for_status(self): pass
            def json(self): return [{"usuario": "test"}]
        return MockResponse()
    monkeypatch.setattr("requests.get", mock_get)
    response = client.get('/api/Asistencia?fecha=2024-06-01')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_registrar_asistencia_manual(client, monkeypatch):
    def mock_post(*args, **kwargs):
        class MockResponse:
            status_code = 201
            text = ''
            def raise_for_status(self): pass
            def json(self): return {"usuario": "test"}
        return MockResponse()
    monkeypatch.setattr("requests.post", mock_post)
    response = client.post('/api/Asistencia/manual', json={"usuario": "test"})
    assert response.status_code == 201