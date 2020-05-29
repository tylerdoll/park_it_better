# std
from bson.json_util import ObjectId

# 3rd party
from flask import Blueprint, jsonify, request

# local
from api.db import get_db
from api.formats import format_generic_record

blueprint = Blueprint("visitor", __name__)


@blueprint.route("/visitor", methods=["POST"])
def post():
    db = get_db()
    visitor = request.json
    db.visitors.insert_one(visitor).inserted_id
    return "", 201


@blueprint.route("/visitor")
def get():
    db = get_db()
    visitors = [format_generic_record(v) for v in db.visitors.find()]
    return jsonify(visitors)


@blueprint.route("/visitor/<visitor_id>", methods=["PUT"])
def put(visitor_id):
    db = get_db()

    data = request.json
    if "_id" in data:
        data.pop("_id")
    update = {"$set": data}

    result = db.visitors.update_one({"_id": ObjectId(visitor_id)}, update)
    if result.matched_count == 0:
        return "", 404
    if result.modified_count == 1:
        return "", 200
    return "", 500


@blueprint.route("/visitor/<visitor_id>", methods=["DELETE"])
def delete(visitor_id):
    db = get_db()
    result = db.visitors.delete_one({"_id": ObjectId(visitor_id)})
    status_code = 404 if result.deleted_count == 0 else 200
    return "", status_code
