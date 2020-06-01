# 3rd party
from flask import Flask
from flask_cors import CORS
from selenium.common.exceptions import WebDriverException

# local
from api import db
from api.exceptions import ResidentNotFoundError, VisitorNotFoundError
from api.error_handlers import (
    handle_io_error,
    handle_runtime_error,
    handle_selenium_errors,
    handle_resident_not_found_error,
    handle_visitor_not_found_error,
)
from api.routes import permit, resident, visitor


def create_app(additional_config=None):
    # Init Flask app
    app = Flask(__name__)
    CORS(app)
    if additional_config:
        app.config.update(additional_config)

    # Database
    db.init_app(app)

    # Blueprints
    app.register_blueprint(permit.blueprint)
    app.register_blueprint(resident.blueprint)
    app.register_blueprint(visitor.blueprint)

    # Error handling
    app.register_error_handler(IOError, handle_io_error)
    app.register_error_handler(RuntimeError, handle_runtime_error)
    app.register_error_handler(WebDriverException, handle_selenium_errors)
    app.register_error_handler(ResidentNotFoundError, handle_resident_not_found_error)
    app.register_error_handler(VisitorNotFoundError, handle_visitor_not_found_error)

    return app


if __name__ == "__main__":
    app = create_app({"PROPAGATE_EXCEPTIONS": False})
    app.run(host="0.0.0.0")
