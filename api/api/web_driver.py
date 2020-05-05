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

_RESIDENT_FIELDS = {
    "property-name",
    "first-name-of-resident",
    "last-name-of-resident",
    "resident-address",
    "resident-apartment",
    "resident-city",
    "resident-state",
    "resident-zip",
}
_VISITOR_FIELDS = {
    "visitor-color",
    "visitor-first-name",
    "visitor-last-name",
    "visitor-license-plate-number",
    "visitor-make",
    "visitor-model",
    "visitor-phone",
    "visitor-state-of-issuance",
    "visitor-email",
    "visitor-address",
    "visitor-apt-number",
    "visitor-city",
    "visitor-zip",
    "visitor-year",
}


def create_driver():
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--disable-extensions")
    return webdriver.Chrome(options=opts)


def submit_visitor_info(driver, resident, visitor):
    if not set(resident.keys()).issubset(_RESIDENT_FIELDS):
        raise KeyError(f"Missing fields\nwhat provided {resident.keys()}\nwhat was expected: {_RESIDENT_FIELDS}")
    if not set(visitor.keys()).issubset(_VISITOR_FIELDS):
        raise KeyError(f"Missing fields\nwhat provided {visitor.keys()}\nwhat was expected: {_VISITOR_FIELDS}")

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
