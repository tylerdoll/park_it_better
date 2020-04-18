# std
from bson.json_util import ObjectId
import logging
import json
import pathlib
import uuid

# 3rd party
from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo as pm

# local
from api.error_handlers import (
    handle_io_error,
    handle_runtime_error,
    handle_selenium_errors,
)
from api.formats import format_visitor
from api.web_driver import create_driver, submit_visitor_info

# Init Flask app
APP = Flask(__name__)
CORS(APP)

# Error handling
APP.register_error_handler(500, handle_io_error)
APP.register_error_handler(500, handle_runtime_error)
APP.register_error_handler(500, handle_selenium_errors)

# Configure Database
APP.config["DB"] = pm.MongoClient("db")


def get_db():
    return APP.config["DB"].parking


@APP.route("/visitors", methods=["POST"])
def post_visitors():
    db = get_db()
    visitor = request.json
    visitor_id = db.visitors.insert_one(visitor).inserted_id
    return "", 201


@APP.route("/visitors")
def get_visitors():
    db = get_db()
    visitors = [format_visitor(v) for v in db.visitors.find()]
    return jsonify(visitors)


# Update
@APP.route("/visitors/<visitor_id>", methods=["PUT"])
def put_visitors(visitor_id):
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


# Delete
@APP.route("/visitors/<visitor_id>", methods=["DELETE"])
def delete_visitors(visitor_id):
    db = get_db()
    result = db.visitors.delete_one({"_id": ObjectId(visitor_id)})
    status_code = 404 if result.deleted_count == 0 else 200
    return "", status_code


@APP.route("/submit_visitors", methods=["POST"])
def post_submit_form():
    db = get_db()
    resident = db.resident.findOne()
    if not resident:
        raise RuntimeError("Could not find resident")

    driver = create_driver()
    visitors = request.json

    responses = []
    for visitor in visitors:
        logging.info(f"Submitting parking info for {visitor['visitor-first-name']}")
        response = submit_visitor_info(driver, resident, visitor)
        responses.append(response)
        logging.debug(response)

    return jsonify(responses)


if __name__ == "__main__":
    APP.run(host="0.0.0.0")
