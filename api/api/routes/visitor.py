# std

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
    db.insert_visitor(visitor)
    return "", 201


@blueprint.route("/visitor")
def get():
    db = get_db()
    visitors = [format_generic_record(v) for v in db.get_visitors()]
    return jsonify(visitors)


@blueprint.route("/visitor/<visitor_id>", methods=["PUT"])
def put(visitor_id):
    db = get_db()

    data = request.json
    db.update_visitor(visitor_id, data)
    return "", 200


@blueprint.route("/visitor/<visitor_id>", methods=["DELETE"])
def delete(visitor_id):
    db = get_db()
    db.delete_visitor(visitor_id)
    return "", 200
