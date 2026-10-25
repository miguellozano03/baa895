import pandas as pd


def actuals_hourly(actuals: pd.DataFrame) -> pd.DataFrame:
    """Average the two 30-minute slots in each hour. Columns: startTime, actual."""
    return (
        actuals.set_index("startTime")["generation"]
        .resample("1h").mean()
        .rename("actual")
        .reset_index()
    )