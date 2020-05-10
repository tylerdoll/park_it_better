class FieldsMismatchError(Exception):
    def __init__(self, expected, got):
        self.expected = expected
        self.got = got
        self.message = f"Missing fields\nexpected: {expected}\ngot:      {got}"

    def __str__(self):
        return self.message
