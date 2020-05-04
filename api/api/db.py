# 3rd party
from flask import current_app, g
import mongomock
import pymongo as pm


def init_app(app):
    app.teardown_appcontext(close_db)


def get_db():
    if "db" not in g:
        if current_app.config["TESTING"]:
            g.db = mongomock.MongoClient()
        else:
            g.db = pm.MongoClient("db")
    return g.db.parking


def close_db(e=None):
    db = g.pop("db", None)
    if db:
        db.close()
