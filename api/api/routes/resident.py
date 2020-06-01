from flask import Blueprint, jsonify, request

from api.db import get_db
from api.formats import format_generic_record

blueprint = Blueprint("resident", __name__)


@blueprint.route("/resident", methods=["POST"])
def post():
    db = get_db()

    resident = request.json
    if "_id" in resident:
        resident.pop("_id")

    result = db.save_resident(resident)
    if result == "UPDATED":
        return "", 200
    if result == "CREATED":
        return "", 201


@blueprint.route("/resident")
def get():
    db = get_db()
    return jsonify(format_generic_record(db.get_resident()))
