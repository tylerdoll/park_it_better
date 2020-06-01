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
    try:
        record["_id"] = str(record["_id"])
    except KeyError:
        pass
    assert record == data


def test_save_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = create_dummy_resident()
        resp = client.post("/resident", json=resident)
        assert resp.status_code == 201
        assert db.get_resident()


def test_get_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = create_dummy_resident()
        db.save_resident(resident)

        resp = client.get("/resident")
        assert resp.status_code == 200
        data = resp.get_json()
        data.pop("_id")
        compare_record(resident, data)


def test_update_resident(app, client):
    with app.app_context():
        db = get_db()

        resident = create_dummy_resident()
        db.save_resident(resident)

        assert db.get_resident()["property-name"] == "Water"
        resident["property-name"] = "Aspen"
        resp = client.post("/resident", json=resident)
        assert resp.status_code == 200
        assert db.get_resident()["property-name"] == "Aspen"


def test_save_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        resp = client.post("/visitor", json=visitor)
        assert resp.status_code == 201
        assert len(db.get_visitors()) == 1


def test_get_empty_visitors(client):
    resp = client.get("/visitor")
    assert len(resp.get_json()) == 0


def test_get_one_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        db.insert_visitor(visitor)

        resp = client.get("/visitor")
        resp_data = resp.get_json()

        assert len(resp_data) == 1
        compare_record(visitor, resp_data[0])


def test_get_multiple_visitors(app, client):
    with app.app_context():
        db = get_db()

        visitors = [create_dummy_visitor(), create_dummy_visitor("travis", "scott")]
        for visitor in visitors:
            db.insert_visitor(visitor)

        resp = client.get("/visitor")
        resp_data = resp.get_json()
        assert len(resp_data) == len(visitors)
        for i in range(len(resp_data)):
            compare_record(visitors[i], resp_data[i])


def test_update_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
        visitor_id = db.insert_visitor(visitor)

        def get_visitor_color():
            return list(filter(lambda v: v["_id"] == visitor_id, db.get_visitors()))[0][
                "visitor-color"
            ]

        assert get_visitor_color() == "white"
        resp = client.put(f"/visitor/{visitor_id}", json={"visitor-color": "black"})
        assert resp.status_code == 200
        assert get_visitor_color() == "black"

        visitor["_id"] = str(visitor["_id"])
        resp = client.put(f"/visitor/{visitor_id}", json=visitor)
        assert resp.status_code == 200

        resp = client.put(f"/visitor/{ObjectId()}", json={"visitor-color": "black"})
        assert resp.status_code == 404


def test_delete_visitor(app, client):
    with app.app_context():
        db = get_db()

        visitor = create_dummy_visitor()
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
            create_dummy_visitor("mike", "jones"),
            create_dummy_visitor("carl", "clarkson"),
            create_dummy_visitor("sean", "dew"),
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
