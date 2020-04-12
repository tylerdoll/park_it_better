class element_is_gone(object):
    """An expectation for checking that an element has been removed.

  locator - used to find the element
  returns True when the element is gone.
  """

    def __init__(self, locator, css_classes):
        self.locator = locator
        self.css_classes = css_classes

    def __call__(self, driver):
        element = driver.find_element(*self.locator)  # Finding the referenced element
        for css_class in self.css_classes:
            if css_class in element.get_attribute("class"):
                print("Found class", css_class)
                return css_class
        return False


class element_has_css_class(object):
    """An expectation for checking that an element has a particular css class.

  locator - used to find the element
  returns the WebElement once it has the particular css class
  """

    def __init__(self, locator, css_classes):
        self.locator = locator
        self.css_classes = css_classes

    def __call__(self, driver):
        element = driver.find_element(*self.locator)  # Finding the referenced element
        for css_class in self.css_classes:
            if css_class in element.get_attribute("class"):
                print("Found class", css_class)
                return css_class
        return False
