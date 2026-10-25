import numpy as np
import pandas as pd

from app.config import TARGET_START, TARGET_END
from app.analysis.preprocess import actuals_hourly


def summary(df: pd.DataFrame) -> dict:
    """Overall metrics. error = forecast - actual (positive = overestimation)."""
    e = df["error"]
    ae = e.abs()
    e_c = e - e.mean()  # error with the bias removed

    return {
        "n": int(len(e)),
        "mae": ae.mean(),
        "rmse": float(np.sqrt((e**2).mean())),
        "bias_mw": e.mean(),
        "bias_pct": e.sum() / df["actual"].sum() * 100,
        "mae_pct_of_mean_actual": ae.mean() / df["actual"].mean() * 100,
        "mae_unbiased": e_c.abs().mean(),
        "rmse_unbiased": float(np.sqrt((e_c**2).mean())),
        "abs_err_p50": ae.quantile(0.50),
        "abs_err_p90": ae.quantile(0.90),
        "abs_err_p99": ae.quantile(0.99),
        "err_p5": e.quantile(0.05),
        "err_p95": e.quantile(0.95),
    }


def by_hour(df: pd.DataFrame) -> pd.DataFrame:
    """Bias and MAE by hour of day (24 rows)."""
    g = df.groupby(df["startTime"].dt.hour)["error"]
    out = pd.DataFrame({"bias": g.mean(), "mae": g.apply(lambda x: x.abs().mean())})
    out.index.name = "hour"
    return out.reset_index()


def by_horizon(fc: pd.DataFrame, actuals: pd.DataFrame) -> pd.DataFrame:
    """Error by lead time, using ALL forecasts with horizon_h > 0
    (not just the active forecast), for the target days."""
    d = fc.rename(columns={"generation": "forecast"}).merge(
        actuals_hourly(actuals), on="startTime"
    )
    d["horizon_h"] = (d["startTime"] - d["publishTime"]).dt.total_seconds() / 3600

    lo = pd.Timestamp(TARGET_START, tz="UTC")
    hi = pd.Timestamp(TARGET_END, tz="UTC")
    d = d[(d["horizon_h"] > 0) & (d["startTime"] >= lo) & (d["startTime"] < hi)].copy()
    d["error"] = d["forecast"] - d["actual"]

    d["bin"] = pd.cut(d["horizon_h"], [0, 6, 12, 24, 36, 48, 72])
    g = d.groupby("bin", observed=True)["error"]
    out = pd.DataFrame({
        "bias": g.mean(),
        "mae": g.apply(lambda x: x.abs().mean()),
        "n": g.count(),
    })
    out.index = out.index.astype(str)
    out.index.name = "horizon_bin"
    return out.reset_index()