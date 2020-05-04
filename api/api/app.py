# 3rd party
from flask import Flask, request
from flask_cors import CORS

# local
from api import db
from api.error_handlers import (
    handle_io_error,
    handle_runtime_error,
    handle_selenium_errors,
)
from api.routes import resident, visitor

def create_app(additional_config=None):
    # Init Flask app
    app = Flask(__name__)
    CORS(app)
    if additional_config:
        app.config.update(additional_config)

    # Error handling
    app.register_error_handler(500, handle_io_error)
    app.register_error_handler(500, handle_runtime_error)
    app.register_error_handler(500, handle_selenium_errors)

    # Database
    db.init_app(app)

    # Blueprints
    app.register_blueprint(resident.blueprint)
    app.register_blueprint(visitor.blueprint)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0")
