"""Backend tests for EXEKUTA Loja de Artes Gráficas feature."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://exekuta-reborn.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@exekuta.com.br"
ADMIN_PASSWORD = "Exekuta@2026"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    tok = data.get("token") or data.get("access_token")
    assert tok, f"No token in response: {data}"
    return tok


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def products(session):
    r = session.get(f"{BASE_URL}/api/loja/products")
    assert r.status_code == 200
    data = r.json()
    assert data.get("ok") is True
    assert isinstance(data.get("items"), list)
    return data["items"]


# ---------- Public catalog ----------
class TestLojaPublic:
    def test_config_public(self, session):
        r = session.get(f"{BASE_URL}/api/loja/config")
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert "whatsapp" in d
        assert "nome_loja" in d

    def test_products_list(self, products):
        assert len(products) >= 4, f"Expected at least 4 seeded products, got {len(products)}"
        for p in products:
            assert "id" in p and "nome" in p and "preco" in p and "tipo" in p and "slug" in p
            assert p["tipo"] in ("digital", "fisico")

    def test_product_detail(self, session, products):
        slug = products[0]["slug"]
        r = session.get(f"{BASE_URL}/api/loja/products/{slug}")
        assert r.status_code == 200
        assert r.json()["product"]["slug"] == slug

    def test_product_detail_404(self, session):
        r = session.get(f"{BASE_URL}/api/loja/products/nao-existe-xyz")
        assert r.status_code == 404


# ---------- Order creation validations ----------
class TestLojaOrderValidation:
    def test_no_lgpd_rejected(self, session, products):
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST User", "whatsapp": "21999999999",
            "itens": [{"produto_id": products[0]["id"], "qtd": 1}],
            "lgpd": False,
        })
        assert r.status_code == 400

    def test_empty_cart_rejected(self, session):
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST User", "whatsapp": "21999999999", "itens": [], "lgpd": True,
        })
        assert r.status_code == 400

    def test_invalid_whatsapp_rejected(self, session, products):
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST User", "whatsapp": "123",
            "itens": [{"produto_id": products[0]["id"], "qtd": 1}], "lgpd": True,
        })
        assert r.status_code == 400

    def test_missing_name_rejected(self, session, products):
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "   ", "whatsapp": "21999999999",
            "itens": [{"produto_id": products[0]["id"], "qtd": 1}], "lgpd": True,
        })
        assert r.status_code == 400

    def test_invalid_product_id(self, session):
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST User", "whatsapp": "21999999999",
            "itens": [{"produto_id": "deadbeef", "qtd": 1}], "lgpd": True,
        })
        assert r.status_code == 400

    def test_fisico_requires_address(self, session, products):
        fisico = next((p for p in products if p["tipo"] == "fisico"), None)
        assert fisico, "No fisico seed product found"
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST User", "whatsapp": "21999999999",
            "itens": [{"produto_id": fisico["id"], "qtd": 1}], "lgpd": True,
        })
        assert r.status_code == 400
        assert "endere" in r.json().get("detail", "").lower()


# ---------- Order creation success ----------
class TestLojaOrderCreate:
    def test_order_digital_success(self, session, products):
        digital = next((p for p in products if p["tipo"] == "digital"), None)
        assert digital
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST Digital Buyer", "whatsapp": "(21) 99999-9999",
            "itens": [{"produto_id": digital["id"], "qtd": 2}], "lgpd": True,
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["codigo"].startswith("EXK-")
        assert d["subtotal"] == round(digital["preco"] * 2, 2)
        assert d["tem_fisico"] is False
        assert "wa.me" in d["whatsapp_url"]

    def test_order_fisico_with_address_success(self, session, products):
        fisico = next((p for p in products if p["tipo"] == "fisico"), None)
        assert fisico
        r = session.post(f"{BASE_URL}/api/loja/order", json={
            "nome": "TEST Fisico Buyer", "whatsapp": "21988887777",
            "email": "test@example.com",
            "itens": [{"produto_id": fisico["id"], "qtd": 1}],
            "endereco": {"cep": "20000-000", "rua": "Rua Teste", "numero": "100",
                         "bairro": "Centro", "cidade": "Rio de Janeiro", "uf": "RJ"},
            "lgpd": True,
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["tem_fisico"] is True
        assert d["codigo"].startswith("EXK-")


# ---------- Admin ----------
class TestLojaAdmin:
    created_id = None

    def test_admin_list_products(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/loja/products", headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.json().get("items"), list)

    def test_admin_requires_auth(self, session):
        r = session.get(f"{BASE_URL}/api/admin/loja/products")
        assert r.status_code in (401, 403)

    def test_admin_create_update_delete_product(self, session, admin_headers):
        # CREATE
        payload = {"nome": "TEST Produto QA", "tipo": "digital", "preco": 49.9,
                   "descricao": "produto de teste", "imagem": "/loja/x.svg", "ativo": True, "ordem": 99}
        r = session.post(f"{BASE_URL}/api/admin/loja/products", headers=admin_headers, json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        pid = body.get("id") or body.get("product", {}).get("id")
        assert pid
        TestLojaAdmin.created_id = pid

        # Verify via admin list (public requires ativo)
        r2 = session.get(f"{BASE_URL}/api/admin/loja/products", headers=admin_headers)
        ids = [p["id"] for p in r2.json()["items"]]
        assert pid in ids

        # UPDATE
        payload["nome"] = "TEST Produto QA Edit"
        payload["preco"] = 59.9
        r = session.put(f"{BASE_URL}/api/admin/loja/products/{pid}", headers=admin_headers, json=payload)
        assert r.status_code == 200
        # Verify persisted
        r3 = session.get(f"{BASE_URL}/api/admin/loja/products", headers=admin_headers)
        updated = next((p for p in r3.json()["items"] if p["id"] == pid), None)
        assert updated and updated["nome"] == "TEST Produto QA Edit" and updated["preco"] == 59.9

        # DELETE
        r = session.delete(f"{BASE_URL}/api/admin/loja/products/{pid}", headers=admin_headers)
        assert r.status_code == 200

    def test_admin_list_orders(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/loja/orders", headers=admin_headers)
        assert r.status_code == 200
        items = r.json().get("items", [])
        assert isinstance(items, list)
        assert len(items) >= 1

    def test_admin_update_order_status_persists(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/loja/orders", headers=admin_headers)
        orders = r.json()["items"]
        assert orders
        oid = orders[0]["id"]
        original_status = orders[0].get("status")
        new_status = "pago" if original_status != "pago" else "producao"
        r2 = session.put(f"{BASE_URL}/api/admin/loja/orders/{oid}/status",
                         headers=admin_headers, json={"status": new_status})
        assert r2.status_code == 200
        # Verify persistence via re-fetch
        r3 = session.get(f"{BASE_URL}/api/admin/loja/orders", headers=admin_headers)
        found = next((o for o in r3.json()["items"] if o["id"] == oid), None)
        assert found and found["status"] == new_status

    def test_admin_invalid_status_rejected(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/loja/orders", headers=admin_headers)
        oid = r.json()["items"][0]["id"]
        r2 = session.put(f"{BASE_URL}/api/admin/loja/orders/{oid}/status",
                         headers=admin_headers, json={"status": "invalido"})
        assert r2.status_code == 400

    def test_admin_config_get_and_save(self, session, admin_headers):
        r = session.get(f"{BASE_URL}/api/admin/loja/config", headers=admin_headers)
        assert r.status_code == 200
        current = r.json()["config"]
        # Save round-trip (preserve values)
        r2 = session.put(f"{BASE_URL}/api/admin/loja/config", headers=admin_headers,
                         json={"data": {"nome_loja": current.get("nome_loja", "EXEKUTA Artes"),
                                        "whatsapp": current.get("whatsapp", "552120381079")}})
        assert r2.status_code == 200
