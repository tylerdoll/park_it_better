# std
import logging
import json
import pathlib
import time

# 3rd party
from flask import Flask, jsonify, request
from flask_cors import CORS

# local
from api.error_handlers import handle_ioerror, handle_selenium_errors
from api.web_driver import create_driver, submit_visitor_info

APP = Flask(__name__)
APP.register_error_handler(500, handle_selenium_errors)
APP.register_error_handler(500, handle_ioerror)
CORS(APP)

_THIS_FILE_PATH = pathlib.Path(__file__).resolve()
APP.config["VISITORS_PATH"] = _THIS_FILE_PATH.parents[0].joinpath("visitors")


@APP.route("/visitors")
def get_visitors():
    logging.debug(f"Visitors path: {APP.config['VISITORS_PATH']}")
    visitor_files = sorted([v for v in APP.config["VISITORS_PATH"].glob("*.json")])
    visitors = [_load_visitor_json(v) for v in visitor_files]
    return jsonify(visitors)


@APP.route("/visitors", methods=["POST"])
def post_visitors():
    visitor = request.json
    logging.debug(visitor)
    _save_visitor_json(visitor)
    return visitor, 201


@APP.route("/submit_visitors", methods=["POST"])
def post_submit_form():
    driver = create_driver()
    resident = APP.config["VISITORS_PATH"] / "resident.json"
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
    fname = f"{visitor['visitor-first-name']}-{visitor['visitor-last-name']}.json"
    path = APP.config["VISITORS_PATH"] / fname
    with open(path, "w") as f:
        json.dump(visitor, f, indent=4)
        logging.info(f"Saved visitor to {path}")


if __name__ == "__main__":
    APP.run(host="0.0.0.0", debug=True)
