from pathlib import Path
import os
import tempfile

import pytest

from api.app import APP, _save_visitor_json


@pytest.fixture
def client(tmpdir):
    APP.config["TESTING"] = True
    APP.config["VISITORS_PATH"] = Path(tmpdir.mkdir("visitors"))

    with APP.test_client() as client:
        yield client


def create_dummy_visitor(first="mark", last="jones"):
    return {
        "visitor-address": "n/a",
        "visitor-apt-number": "n/a",
        "visitor-city": "n/a",
        "visitor-color": "white",
        "visitor-email": "email@address.com",
        "visitor-first-name": first,
        "visitor-last-name": last,
        "visitor-license-plate-number": "ajk798",
        "visitor-make": "honda",
        "visitor-model": "civic",
        "visitor-phone": "904-476-8779",
        "visitor-state-of-issuance": "CO",
        "visitor-year": "2002",
        "visitor-zip": "n/a",
    }


def test_save_visitor(client):
    visitor = create_dummy_visitor()
    resp = client.post("/visitors", json=visitor)
    assert resp.get_json() == visitor
    assert resp.status_code == 201


def test_get_visitors(client):
    # Empty
    resp = client.get("/visitors")
    assert len(resp.get_json()) is 0

    # One visitor
    visitors = [create_dummy_visitor()]
    _save_visitor_json(visitors[0])
    resp = client.get("/visitors")
    resp_data = resp.get_json()
    assert len(resp_data) is 1
    assert resp_data[0] == visitors[0]

    # Multiple visitors
    visitors.append(create_dummy_visitor("travis", "scott"))
    _save_visitor_json(visitors[1])
    resp = client.get("/visitors")
    resp_data = resp.get_json()
    print(resp_data)
    assert len(resp_data) is 2
    assert resp_data[0] == visitors[0]
    assert resp_data[1] == visitors[1]
