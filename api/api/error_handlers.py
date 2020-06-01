# std
import logging
import traceback


def handle_resident_not_found_error(func):
    return _handle_generic_exception(404)


def handle_visitor_not_found_error(func):
    return _handle_generic_exception(404)


def handle_io_error(func):
    return _handle_generic_exception()


def handle_runtime_error(e):
    return _handle_generic_exception()


def handle_selenium_errors(e):
    return _handle_generic_exception()


def _handle_generic_exception(status_code=500):
    err = traceback.format_exc()
    logging.error(err)
    return err, status_code
