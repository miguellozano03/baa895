from functools import lru_cache

import pandas as pd

from app.analysis.forecasts import build_dataset
from app.data import load_actuals, load_forecasts


@lru_cache(maxsize=1)
def get_raw() -> tuple[pd.DataFrame, pd.DataFrame]:
    return load_forecasts(), load_actuals()


@lru_cache(maxsize=24)
def get_dataset(decision_hour: int) -> pd.DataFrame:
    fc, act = get_raw()
    return build_dataset(fc, act, decision_hour)