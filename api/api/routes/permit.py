# std
from datetime import datetime
import logging
import random

# 3rd party
from flask import Blueprint, current_app, jsonify, request

# local
from api.db import get_db
from api.formats import format_history
from api.park_it_right import create_driver, submit_visitor_info

blueprint = Blueprint("permit", __name__)


@blueprint.route("/permit", methods=["POST"])
def post():
    db = get_db()
    resident = db.resident.find_one(projection={"_id": False})
    if not resident:
        raise RuntimeError("Could not find resident")

    driver = create_driver()
    visitors = request.json

    responses = []
    for visitor in visitors:
        fields_to_submit = visitor.copy()
        fields_to_submit.pop("_id")

        if current_app.config["ENV"] == "development":
            response = _fake_submit(visitor)
        else:
            logging.info(f"Submitting parking info for {visitor}")
            succeeded, msg = submit_visitor_info(driver, resident, fields_to_submit)
            response = _create_response(visitor, succeeded, msg)

        responses.append(response)
        logging.debug(response)

        if response["succeeded"]:
            _add_to_history(visitor)

    return jsonify(responses)


@blueprint.route("/permit/history", methods=["GET"])
def get_history():
    db = get_db()
    records = db.history.find()
    formatted_history = format_history(records)
    return jsonify(formatted_history)


def _add_to_history(visitor, timestamp=datetime.now().timestamp()):
    db = get_db()
    db.history.insert_one({"timestamp": timestamp, "visitor": visitor})


def _create_response(visitor, succeeded, msg):
    return {"visitor": visitor, "succeeded": succeeded, "response": msg}


def _fake_submit(visitor):
    succeeded = random.randint(0, 1)
    if succeeded:
        logging.warning(f"Faking successful submit for {visitor}")
        return _create_response(visitor, True, "FAKE: Succesfully submitted")
    else:
        logging.warning(f"Faking fail submit for {visitor}")
        return _create_response(visitor, False, "FAKE: Error while submitting")
