import pandas as pd


def actuals_hourly(actuals: pd.DataFrame) -> pd.DataFrame:
    """Promedia los dos slots de 30 min de cada hora. Columnas: startTime, actual."""
    return (
        actuals.set_index("startTime")["generation"]
        .resample("1h").mean()
        .rename("actual")
        .reset_index()
    )