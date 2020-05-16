# std
from datetime import datetime

# 3rd party
from flask import Blueprint, jsonify

# local
from api.db import get_db
from api.formats import format_history

blueprint = Blueprint("history", __name__)


@blueprint.route("/history", methods=["GET"])
def get():
    db = get_db()
    records = db.history.find()
    formatted_history = format_history(records)
    return jsonify(formatted_history)


def add_to_history(visitor, timestamp=datetime.now().timestamp()):
    db = get_db()
    db.history.insert_one({"timestamp": timestamp, "visitor": visitor})
