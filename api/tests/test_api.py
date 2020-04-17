from bson.json_util import ObjectId
from pathlib import Path
import os
import uuid

import pytest
import mongomock

from api.app import APP, get_db


@pytest.fixture
def client(tmpdir):
    APP.config["TESTING"] = True
    APP.config["DB"] = mongomock.MongoClient().parking

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


def compare_visitor(mongo_visitor, visitor):
    mongo_visitor["_id"] = str(mongo_visitor["_id"])
    assert mongo_visitor == visitor


def test_save_visitor(client):
    db = get_db()

    visitor = create_dummy_visitor()
    resp = client.post("/visitors", json=visitor)
    assert resp.status_code == 201
    assert db.visitors.count_documents({}) == 1


def test_get_empty_visitors(client):
    resp = client.get("/visitors")
    assert len(resp.get_json()) is 0


def test_get_only_visitor(client):
    db = get_db()

    visitor = create_dummy_visitor()
    db.visitors.insert_one(visitor)

    resp = client.get("/visitors")
    resp_data = resp.get_json()

    assert len(resp_data) is 1
    compare_visitor(visitor, resp_data[0])


def test_get_multiple_visitors(client):
    db = get_db()

    visitors = [create_dummy_visitor(), create_dummy_visitor("travis", "scott")]
    db.visitors.insert_many(visitors)

    resp = client.get("/visitors")
    resp_data = resp.get_json()
    assert len(resp_data) == len(visitors)
    for i in range(len(resp_data)):
        compare_visitor(visitors[i], resp_data[i])


def test_update_visitor(client):
    db = get_db()

    visitor = create_dummy_visitor()
    visitor_id = db.visitors.insert_one(visitor).inserted_id

    assert db.visitors.find_one({"_id": visitor["_id"]})["visitor-color"] == "white"
    resp = client.put(f"/visitors/{visitor_id}", json={"visitor-color": "black"})
    assert resp.status_code == 200
    assert db.visitors.find_one({"_id": visitor["_id"]})["visitor-color"] == "black"

    resp = client.put(f"/visitors/{ObjectId()}", json={"visitor-color": "black"})
    assert resp.status_code == 404


def test_delete_visitor(client):
    db = get_db()

    visitor = create_dummy_visitor()
    visitor_id = db.visitors.insert_one(visitor).inserted_id
    assert db.visitors.count_documents({}) == 1

    resp = client.delete(f"/visitors/{visitor_id}")
    assert resp.status_code == 200
    assert db.visitors.count_documents({}) == 0

    resp = client.delete(f"/visitors/{visitor_id}")
    assert resp.status_code == 404
