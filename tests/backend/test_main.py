from fastapi.testclient import TestClient

from app.main import app


def test_health_check() -> None:
    client = TestClient(app)
    response = client.get("/api/v1/recommendations/sample")
    assert response.status_code == 200
    payload = response.json()
    assert payload["profile_id"] == "demo-user"
    assert "plan" in payload
