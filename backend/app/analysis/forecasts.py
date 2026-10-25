import pandas as pd

from app.config import TARGET_START, TARGET_END
from app.analysis.preprocess import actuals_hourly


def decision_forecasts(fc: pd.DataFrame, decision_hour: int) -> pd.DataFrame:
    """Para cada startTime, el último pronóstico publicado antes del corte
    (D-1 a decision_hour, UTC). Devuelve: startTime, publishTime, forecast, horizon_h."""
    d = fc.rename(columns={"generation": "forecast"}).copy()

    target_day = d["startTime"].dt.floor("D")
    cutoff = target_day - pd.Timedelta(days=1) + pd.Timedelta(hours=decision_hour)

    d = d[d["publishTime"] <= cutoff]                                # solo lo que existía al decidir
    d = d.sort_values("publishTime").groupby("startTime").tail(1)    # el más reciente por hora
    d["horizon_h"] = (d["startTime"] - d["publishTime"]).dt.total_seconds() / 3600

    return d.sort_values("startTime").reset_index(drop=True)


def build_dataset(fc: pd.DataFrame, actuals: pd.DataFrame, decision_hour: int) -> pd.DataFrame:
    """Pronóstico vigente + real horario, limitado a los días objetivo, con error = forecast - actual."""
    dec = decision_forecasts(fc, decision_hour)
    df = dec.merge(actuals_hourly(actuals), on="startTime", how="inner")

    lo = pd.Timestamp(TARGET_START, tz="UTC")
    hi = pd.Timestamp(TARGET_END, tz="UTC")
    df = df[(df["startTime"] >= lo) & (df["startTime"] < hi)].copy()

    df["error"] = df["forecast"] - df["actual"]    # positivo = el pronóstico sobreestimó
    return df.reset_index(drop=True)