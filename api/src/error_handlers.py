import logging
import traceback

from selenium.common.exceptions import WebDriverException


def handle_ioerror(func):
    def inner(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except IOError:
            err = traceback.format_exc()
            logging.error(err)
            return err

    return inner


def handle_selenium_errors(func):
    def inner(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except WebDriverException:
            err = traceback.format_exc()
            logging.error(err)
            return err

    return inner
