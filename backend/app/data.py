import pandas as pd
from app.config import DATA_DIR


def load_actuals() -> pd.DataFrame:
    return pd.read_parquet(DATA_DIR / "actuals.parquet")


def load_forecasts() -> pd.DataFrame:
    return pd.read_parquet(DATA_DIR / "forecasts.parquet")