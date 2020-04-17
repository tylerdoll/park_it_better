from bson.json_util import dumps
from json import loads

def format_visitor(mongo_visitor):
    # Convert to a python dict
    visitor = dumps(mongo_visitor)
    visitor = loads(visitor)

    # Flatten _id field to a string
    visitor["_id"] = visitor["_id"]["$oid"]

    return visitor
