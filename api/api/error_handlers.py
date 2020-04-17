# std
import logging
import traceback

# 3rd party
from selenium.common.exceptions import WebDriverException

def handle_io_error(func):
    return _handle_generic_exception(IOError, func)


def handle_runtime_error(func):
    return _handle_generic_exception(RuntimeError, func)


def handle_selenium_errors(func):
    return _handle_generic_exception(WebDriverException, func)


def _handle_generic_exception(exception, func):
    def inner(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except exception:
            err = traceback.format_exc()
            logging.error(err)
            return err

    return inner
