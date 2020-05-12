from bson.json_util import ObjectId
from datetime import datetime, timedelta

from api.db import get_db
from api.formats import format_generic_record, format_history_date


def create_dummy_resident():
    return {
        "property-name": "Water",
        "first-name-of-resident": "Elon",
        "last-name-of-resident": "Musk",
        "resident-address": "1 St. Mars",
        "resident-apartment": 1337,
        "resident-city": "Doom",
        "resident-state": "Mars",
        "resident-zip": 9001,
    }


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


def compare_record(record, data):
    record["_id"] = str(record["_id"])
    assert record == data


def test_save_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = create_dummy_resident()
        resp = client.post("/resident", json=resident)
        assert resp.status_code == 201
        assert db.resident.count_documents({}) == 1


def test_get_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = create_dummy_resident()
        db.resident.insert_one(resident)

        resp = client.get("/resident")
        assert resp.status_code == 200
        compare_record(resident, resp.get_json())


def test_update_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = create_dummy_resident()
        db.resident.insert_one(resident)

        assert (
            db.resident.find_one({"_id": resident["_id"]})["property-name"] == "Water"
        )
        resident["property-name"] = "Aspen"
        resident["_id"] = str(resident["_id"])
        resp = client.post("/resident", json=resident)
        assert resp.status_code == 200
        assert db.resident.find_one({})["property-name"] == "Aspen"


def test_save_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        resp = client.post("/visitor", json=visitor)
        assert resp.status_code == 201
        assert db.visitors.count_documents({}) == 1


def test_get_empty_visitors(client):
    resp = client.get("/visitor")
    assert len(resp.get_json()) == 0


def test_get_only_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        db.visitors.insert_one(visitor)

        resp = client.get("/visitor")
        resp_data = resp.get_json()

        assert len(resp_data) == 1
        compare_record(visitor, resp_data[0])


def test_get_multiple_visitors(app, client):
    with app.app_context():
        db = get_db()

        visitors = [create_dummy_visitor(), create_dummy_visitor("travis", "scott")]
        db.visitors.insert_many(visitors)

        resp = client.get("/visitor")
        resp_data = resp.get_json()
        assert len(resp_data) == len(visitors)
        for i in range(len(resp_data)):
            compare_record(visitors[i], resp_data[i])


def test_update_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        visitor_id = db.visitors.insert_one(visitor).inserted_id

        assert db.visitors.find_one({"_id": visitor["_id"]})["visitor-color"] == "white"
        resp = client.put(f"/visitor/{visitor_id}", json={"visitor-color": "black"})
        assert resp.status_code == 200
        assert db.visitors.find_one({"_id": visitor["_id"]})["visitor-color"] == "black"

        visitor["_id"] = str(visitor["_id"])
        resp = client.put(f"/visitor/{visitor_id}", json=visitor)
        assert resp.status_code == 200

        resp = client.put(f"/visitor/{ObjectId()}", json={"visitor-color": "black"})
        assert resp.status_code == 404


def test_delete_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        visitor_id = db.visitors.insert_one(visitor).inserted_id
        assert db.visitors.count_documents({}) == 1

        resp = client.delete(f"/visitor/{visitor_id}")
        assert resp.status_code == 200
        assert db.visitors.count_documents({}) == 0

        resp = client.delete(f"/visitor/{visitor_id}")
        assert resp.status_code == 404


def test_history(app, client):
    with app.app_context():
        db = get_db()

        resp = client.get("/history")
        assert resp.status_code == 200
        assert resp.get_json() == []

        visitors = [
            create_dummy_visitor("mike", "jones"),        
            create_dummy_visitor("carl", "clarkson"),        
            create_dummy_visitor("sean", "dew"),        
        ]
        db.visitors.insert_many(visitors)

        times = [
            datetime.now(),
            datetime.now() - timedelta(3),
        ]
        records = [
            {
                "timestamp": times[0].timestamp(),
                "visitor": visitors[0],
            },
            {
                "timestamp": times[0].timestamp(),
                "visitor": visitors[1],
            },
            {
                "timestamp": times[1].timestamp(),
                "visitor": visitors[2],
            },
        ]
        db.history.insert_many(records)

        visitors = [format_generic_record(visitor) for visitor in visitors]
        expected_response = [
            {
                "date": format_history_date(times[0]),
                "visitors": [visitors[0], visitors[1]],
            },
            {
                "date": format_history_date(times[1]),
                "visitors": [visitors[2]],
            },
        ]
        resp = client.get("/history")
        assert resp.status_code == 200
        assert resp.get_json() == expected_response
