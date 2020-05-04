# std
from bson.json_util import ObjectId
import logging

# 3rd party
from flask import Blueprint, jsonify, request

# local
from api.db import get_db
from api.formats import format_record
from api.web_driver import create_driver, submit_visitor_info

blueprint = Blueprint("visitor", __name__)


@blueprint.route("/visitor", methods=["POST"])
def post():
    db = get_db()
    visitor = request.json
    visitor_id = db.visitors.insert_one(visitor).inserted_id
    return "", 201


@blueprint.route("/visitor")
def get():
    db = get_db()
    visitors = [format_record(v) for v in db.visitors.find()]
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


@blueprint.route("/visitor/submit", methods=["POST"])
def post_submit_form():
    db = get_db()
    resident = db.resident.find_one(projection={"_id": False})
    if not resident:
        raise RuntimeError("Could not find resident")

    driver = create_driver()
    visitors = request.json

    responses = []
    for visitor in visitors:
        if "_id" in visitor:
            visitor.pop("_id")
        logging.info(f"Submitting parking info for {visitor}")
        response = submit_visitor_info(driver, resident, visitor)
        responses.append(response)
        logging.debug(response)

    return jsonify(responses)
