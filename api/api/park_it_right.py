# std
import re

# 3rd party
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# local
from api.expected_conditions import element_has_css_class

_FORM_URL = (
    "https://www.parkitrightpermit.com/park-it-right-contact-visitor-permit-request/"
)
_FORM_XPATH = "/html/body/div[1]/div[3]/div/div/div[1]/div/div/div/div[1]/div/form"
_FORM_SENT_CSS_CLASS = "sent"
_FORM_INVALID_CSS_CLASS = "invalid"
_FORM_RESPONSE_ELEM_CLASS = "wpcf7-response-output"

_SUBMIT_BTN = "visitors"
_LOADER_ID = "jpreOverlay"


def create_driver():
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--disable-extensions")
    return webdriver.Chrome(options=opts)


def submit_visitor_info(driver, resident, visitor):
    resident = _format_visitor(resident)
    visitor = _format_resident(visitor)

    driver.get(_FORM_URL)
    try:
        _wait_for_loader_to_stop(driver)
    except TimeoutException:
        return False, "Timeout while waiting for loader to go away"

    _fill_form_inputs(driver, resident)
    _fill_form_inputs(driver, visitor)

    driver.find_element_by_id(_SUBMIT_BTN).click()

    try:
        msg = _check_for_invalid_response(driver)
        succeeded = False  # If we didn't timeout that means the form was invalid
    except TimeoutException:
        succeeded = True
        msg = "Permit submitted"
    finally:
        return succeeded, msg


def _format_visitor(db_visitor):
    first, last = db_visitor["fullName"].split(" ", 1)
    return {
        "visitor-first-name": first,
        "visitor-last-name": last,
        "visitor-phone": db_visitor["phone"],
        "visitor-email": db_visitor["email"],
        "visitor-address": db_visitor["address"],
        "visitor-apt-number": db_visitor["unit"],
        "visitor-city": db_visitor["city"],
        "visitor-zip": db_visitor["zip"],
        "visitor-color": db_visitor["vehicleColor"],
        "visitor-year": db_visitor["vehicleYear"],
        "visitor-make": db_visitor["vehicleMake"],
        "visitor-model": db_visitor["vehicleModel"],
        "visitor-state-of-issuance": db_visitor["vehicleState"],
        "visitor-license-plate-number": re.sub(" -", "", db_visitor["vehiclePlate"]),
    }


def _format_resident(db_resident):
    first, last = db_resident["fullName"].split(" ", 1)
    return {
        "property-name": db_resident["property"],
        "first-name-of-resident": first,
        "last-name-of-resident": last,
        "resident-address": db_resident["address"],
        "resident-apartment": db_resident["unit"],
        "resident-city": db_resident["city"],
        "resident-state": db_resident["state"],
        "resident-zip": db_resident["zip"],
    }


def _fill_form_inputs(driver, inputs):
    for k, v in inputs.items():
        driver.find_element_by_name(k).send_keys(v)


def _check_for_invalid_response(driver):
    timeout_s = 3
    wait = WebDriverWait(driver, timeout_s)
    wait.until(
        element_has_css_class((By.XPATH, _FORM_XPATH), [_FORM_INVALID_CSS_CLASS])
    )
    return driver.find_element_by_class_name(_FORM_RESPONSE_ELEM_CLASS).text


def _wait_for_loader_to_stop(driver):
    find_loader_timeout_s = 3
    done_loading_timeout_s = 5

    WebDriverWait(driver, find_loader_timeout_s).until(
        EC.presence_of_element_located((By.ID, _LOADER_ID))
    )
    WebDriverWait(driver, done_loading_timeout_s).until_not(
        EC.presence_of_element_located((By.ID, _LOADER_ID))
    )
