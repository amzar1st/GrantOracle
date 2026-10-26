"""Fictional grant deliverable for reproducible GrantOracle demonstrations.

This source file proves code-level behavior only, not execution or adoption.
"""


def authorize_payment(checks):
    """Return True only for a non-empty list containing exclusively SUPPORTED."""
    if not checks:
        return False
    return all(status == 'SUPPORTED' for status in checks)


def count_supported(checks):
    """Count exactly the criteria marked SUPPORTED."""
    return sum(1 for status in checks if status == 'SUPPORTED')
