from bson.json_util import ObjectId
from datetime import datetime, timedelta

from api.db import get_db
from api.formats import format_generic_record, format_history_date


def _create_dummy_resident():
    return {
        "property": "Water",
        "fullName": "Elon Musk",
        "address": "1 St. Mars",
        "unit": 1337,
        "city": "Doom",
        "state": "Mars",
        "zip": 9001,
    }


def _create_dummy_visitor(name="mark jones"):
    return {
        "fullName": name,
        "email": "email@address.com",
        "phone": "904-476-8779",
        "address": "n/a",
        "unit": "n/a",
        "city": "n/a",
        "zip": "n/a",
        "vehiclePlate": "ajk-798",
        "vehicleColor": "white",
        "vehicleMake": "honda",
        "vehicleModel": "civic",
        "vehicleState": "CO",
        "vehicleYear": 2002,
    }


def _compare_record(record, data):
    try:
        record["_id"] = str(record["_id"])
    except KeyError:
        pass
    assert record == data


def test_save_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = _create_dummy_resident()
        resp = client.post("/resident", json=resident)
        assert resp.status_code == 201
        assert db.get_resident()


def test_get_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = _create_dummy_resident()
        db.save_resident(resident)

        resp = client.get("/resident")
        assert resp.status_code == 200
        data = resp.get_json()
        data.pop("_id")
        _compare_record(resident, data)


def test_update_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = _create_dummy_resident()
        db.save_resident(resident)

        assert db.get_resident()["property"] == "Water"
        resident["property"] = "Aspen"
        resp = client.post("/resident", json=resident)
        assert resp.status_code == 200
        assert db.get_resident()["property"] == "Aspen"


def test_save_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = _create_dummy_visitor()
        resp = client.post("/visitor", json=visitor)
        assert resp.status_code == 201
        assert len(db.get_visitors()) == 1


def test_get_empty_visitors(client):
    resp = client.get("/visitor")
    assert len(resp.get_json()) == 0


def test_get_one_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = _create_dummy_visitor()
        db.insert_visitor(visitor)

        resp = client.get("/visitor")
        resp_data = resp.get_json()

        assert len(resp_data) == 1
        _compare_record(visitor, resp_data[0])


def test_get_multiple_visitors(app, client):
    with app.app_context():
        db = get_db()

        visitors = [_create_dummy_visitor(), _create_dummy_visitor("travis scott")]
        for visitor in visitors:
            db.insert_visitor(visitor)

        resp = client.get("/visitor")
        resp_data = resp.get_json()
        assert len(resp_data) == len(visitors)
        for i in range(len(resp_data)):
            _compare_record(visitors[i], resp_data[i])


def test_update_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = _create_dummy_visitor()
        visitor_id = db.insert_visitor(visitor)

        def get_visitor_color():
            return list(filter(lambda v: v["_id"] == visitor_id, db.get_visitors()))[0][
                "vehicleColor"
            ]

        assert get_visitor_color() == "white"
        resp = client.put(f"/visitor/{visitor_id}", json={"vehicleColor": "black"})
        assert resp.status_code == 200
        assert get_visitor_color() == "black"

        visitor["_id"] = str(visitor["_id"])
        resp = client.put(f"/visitor/{visitor_id}", json=visitor)
        assert resp.status_code == 200

        resp = client.put(f"/visitor/{ObjectId()}", json={"vehicleColor": "black"})
        assert resp.status_code == 404


def test_delete_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = _create_dummy_visitor()
        visitor_id = db.insert_visitor(visitor)
        assert len(db.get_visitors()) == 1

        resp = client.delete(f"/visitor/{visitor_id}")
        assert len(db.get_visitors()) == 0

        resp = client.delete(f"/visitor/{visitor_id}")
        assert resp.status_code == 404


def test_history(app, client):
    with app.app_context():
        db = get_db()

        # Check that history is empty
        resp = client.get("/permit/history")
        assert resp.status_code == 200
        assert resp.get_json() == []

        # Check that the api can retrieve records
        visitors = [
            _create_dummy_visitor("mike jones"),
            _create_dummy_visitor("carl clarkson"),
            _create_dummy_visitor("sean dew"),
        ]
        for visitor in visitors:
            db.insert_visitor(visitor)
        times = [datetime.now(), datetime.now() - timedelta(3)]
        db.add_history(visitors[0], times[0].timestamp())
        db.add_history(visitors[1], times[0].timestamp())
        db.add_history(visitors[2], times[1].timestamp())
        visitors = [format_generic_record(visitor) for visitor in visitors]
        expected_response = [
            {
                "date": format_history_date(times[0]),
                "visitors": [visitors[0], visitors[1]],
            },
            {"date": format_history_date(times[1]), "visitors": [visitors[2]]},
        ]
        resp = client.get("/permit/history")
        assert resp.status_code == 200
        assert resp.get_json() == expected_response
