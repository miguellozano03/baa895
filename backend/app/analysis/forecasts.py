import pandas as pd

from app.config import TARGET_START, TARGET_END
from app.analysis.preprocess import actuals_hourly


def decision_forecasts(fc: pd.DataFrame, decision_hour: int) -> pd.DataFrame:
    """For each startTime, the latest forecast published before the cutoff
    (D-1 at decision_hour, UTC). Returns: startTime, publishTime, forecast, horizon_h."""
    d = fc.rename(columns={"generation": "forecast"}).copy()

    target_day = d["startTime"].dt.floor("D")
    cutoff = target_day - pd.Timedelta(days=1) + pd.Timedelta(hours=decision_hour)

    d = d[d["publishTime"] <= cutoff]                                # only forecasts available at decision time
    d = d.sort_values("publishTime").groupby("startTime").tail(1)    # latest forecast for each hour
    d["horizon_h"] = (d["startTime"] - d["publishTime"]).dt.total_seconds() / 3600

    return d.sort_values("startTime").reset_index(drop=True)


def build_dataset(fc: pd.DataFrame, actuals: pd.DataFrame, decision_hour: int) -> pd.DataFrame:
    """Active forecast and hourly actuals for the target days, with error = forecast - actual."""
    dec = decision_forecasts(fc, decision_hour)
    df = dec.merge(actuals_hourly(actuals), on="startTime", how="inner")

    lo = pd.Timestamp(TARGET_START, tz="UTC")
    hi = pd.Timestamp(TARGET_END, tz="UTC")
    df = df[(df["startTime"] >= lo) & (df["startTime"] < hi)].copy()

    df["error"] = df["forecast"] - df["actual"]    # positive = the forecast overestimated
    return df.reset_index(drop=True)