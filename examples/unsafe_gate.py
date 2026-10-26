"""Deliberately unsafe counterexample, solely for a rejected-milestone demo."""


def authorize_payment(checks):
    # Incorrect: authorizes even UNKNOWN or CONTRADICTED criteria.
    return True
