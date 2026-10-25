import pandas as pd
from app.analysis.forecast import decision_forecasts


def make_fc():
    """Pronósticos sintéticos para una hora objetivo, con publishTime antes y después del corte."""
    # TODO


def test_no_leakage():
    """Ningún publishTime elegido es posterior a (D-1 a decision_hour)."""
    # TODO


def test_picks_latest_before_cutoff():
    """Entre varios válidos, elige el de publishTime más reciente."""
    # TODO


def test_min_horizon():
    """horizon_h mínimo >= 24 - decision_hour."""
    # TODO