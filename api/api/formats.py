from bson.json_util import dumps
from json import loads

def format_record(mongo_record):
    # Convert to a python dict
    record = dumps(mongo_record)
    record = loads(record)

    # Flatten _id field to a string
    record["_id"] = record["_id"]["$oid"]

    return record
