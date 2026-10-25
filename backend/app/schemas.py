from pydantic import BaseModel


class ForecastPoint(BaseModel):
    time: str
    forecast: float
    actual: float | None
    error: float | None
    horizon_h: float


class ForecastResponse(BaseModel):
    target_date: str
    decision_hour: int
    decision_cutoff: str
    points: list[ForecastPoint]


class MetricsResponse(BaseModel):
    n: int
    mae: float
    rmse: float
    bias_mw: float
    bias_pct: float
    mae_pct_of_mean_actual: float
    mae_unbiased: float
    rmse_unbiased: float
    abs_err_p50: float
    abs_err_p90: float
    abs_err_p99: float
    err_p5: float
    err_p95: float


class ByHourRow(BaseModel):
    hour: int
    bias: float
    mae: float


class ByHorizonRow(BaseModel):
    horizon_bin: str
    bias: float
    mae: float
    n: int