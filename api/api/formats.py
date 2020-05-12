from bson.json_util import dumps
from datetime import datetime
from json import loads


def format_generic_record(record):
    record = _convert_to_dict(record)

    # Flatten _id field to a string
    record["_id"] = record["_id"]["$oid"]

    return record

def format_history_date(date):
    return date.strftime("%A, %B %d, %Y")


def format_history(records):
    dates = {}

    for record in records:
        record = _convert_to_dict(record)
        record.pop("_id")
        visitor = format_generic_record(record["visitor"])
        date = format_history_date(datetime.fromtimestamp(record["timestamp"]))

        try:
            dates[date].append(visitor)
        except KeyError:
            dates[date] = [visitor]

    return [{"date": date, "visitors": visitors} for date, visitors in dates.items()]


def _convert_to_dict(record):
    return loads(dumps(record))
