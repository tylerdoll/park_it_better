from flask import Blueprint, jsonify, request

from api.db import get_db
from api.formats import format_record

blueprint = Blueprint("resident", __name__)


@blueprint.route("/resident", methods=["POST"])
def post():
    db = get_db()

    resident = request.json
    if "_id" in resident:
        resident.pop("_id")

    result = db.resident.replace_one({}, resident, upsert=True)
    if result.matched_count == 0:
        return "", 201
    if result.modified_count == 1:
        return "", 200
    return "", 500


@blueprint.route("/resident")
def get():
    db = get_db()
    resident = db.resident.find_one()
    if resident is None:
        return "", 404
    else:
        return jsonify(format_record(resident))
