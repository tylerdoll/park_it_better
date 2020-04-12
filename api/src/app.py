# std
import logging
import json
import pathlib
import time

# 3rd party
from flask import Flask, jsonify, request
from flask_cors import CORS

# local
from error_handlers import handle_ioerror, handle_selenium_errors
from web_driver import create_driver, submit_visitor_info

_APP = Flask(__name__)
_APP.register_error_handler(500, handle_selenium_errors)
_APP.register_error_handler(500, handle_ioerror)
CORS(_APP)

_THIS_FILE_PATH = pathlib.Path(__file__).resolve()
_VISITORS_PATH = _THIS_FILE_PATH.parents[0] / pathlib.Path("visitors")


@_APP.route("/visitors")
def get_visitors():
    visitor_files = [v for v in _VISITORS_PATH.glob("*.json")]
    visitors = [_load_visitor_json(v) for v in visitor_files]
    return jsonify(visitors)


@_APP.route("/visitors", methods=["POST"])
def post_visitors():
    visitor = request.json
    logging.debug(visitor)
    _save_visitor_json(visitor)
    return visitor, 201


@_APP.route("/submit_visitors", methods=["POST"])
def post_submit_form():
    driver = create_driver()
    resident = _VISITORS_PATH / "resident.json"
    visitors = request.json

    responses = []
    for visitor in visitors:
        logging.info(f"Submitting parking info for {visitor['visitor-first-name']}")
        response = submit_visitor_info(driver, resident, visitor)
        responses.append(response)
        logging.debug(response)

    return jsonify(responses)


def _load_visitor_json(path):
    with open(path) as f:
        return json.load(f)

def _save_visitor_json(visitor):
    path = (
        _VISITORS_PATH
        / f"{visitor['visitor-first-name']}-{visitor['visitor-last-name']}.json"
    )
    with open(path, "w") as f:
        json.dump(visitor, f, indent=4)
        logging.info(f"Saved visitor to {path}")


if __name__ == "__main__":
    _APP.run(host="0.0.0.0", debug=True)
