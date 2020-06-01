# std
from bson.json_util import ObjectId
from datetime import datetime

# 3rd party
from flask import current_app, g
import mongomock
import pymongo as pm

# Local
from api.exceptions import ResidentNotFoundError, VisitorNotFoundError


def init_app(app):
    app.teardown_appcontext(close_db)


def get_db():
    if "db" not in g:
        g.db = Database()
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db:
        db.close()


class Database:
    def __init__(self):
        self._client = (
            mongomock.MongoClient()
            if current_app.config["TESTING"]
            else pm.MongoClient("db")
        )
        self._db = self._client.parking

    def close(self):
        self._client.close()

    # History
    def get_history(self):
        return self._db.history.find()

    def add_history(self, visitor, timestamp=datetime.now().timestamp()):
        self._db.history.insert_one({"timestamp": timestamp, "visitor": visitor})

    # Resident
    def save_resident(self, resident):
        result = self._db.resident.replace_one({}, resident, upsert=True)
        if result.matched_count == 0:
            return "CREATED"
        if result.modified_count == 1:
            return "UPDATED"
        raise RuntimeError("Could not save resident.")

    def get_resident(self):
        resident = self._db.resident.find_one()
        if resident is None:
            raise ResidentNotFoundError()
        return resident

    # Visitor
    def insert_visitor(self, visitor):
        return self._db.visitors.insert_one(visitor).inserted_id

    def get_visitors(self):
        return list(self._db.visitors.find())

    def update_visitor(self, visitor_id, data):
        if "_id" in data:
            data.pop("_id")
        update = {"$set": data}

        result = self._db.visitors.update_one({"_id": ObjectId(visitor_id)}, update)
        if result.matched_count == 0:
            raise VisitorNotFoundError(visitor_id)
        if result.modified_count != 1:
            raise RuntimeError("Unknown error. Did not modify visitor.")

    def delete_visitor(self, visitor_id):
        result = self._db.visitors.delete_one({"_id": ObjectId(visitor_id)})
        if result.deleted_count == 0:
            raise VisitorNotFoundError(visitor_id)
