class CustomException(Exception):
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message


class ResidentNotFoundError(CustomException):
    def __init__(self):
        CustomException.__init__(self, "Resident not found")


class VisitorNotFoundError(CustomException):
    def __init__(self, visitor_id):
        CustomException.__init__(self, f"Could not find visitor with ID {visitor_id}")


class FieldsMismatchError(CustomException):
    def __init__(self, expected, got):
        CustomException.__init__(
            self, f"Missing fields\nexpected: {expected}\ngot:      {got}"
        )
