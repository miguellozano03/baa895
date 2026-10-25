from datetime import date

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from app.api.deps import get_dataset
from app.config import DEFAULT_DECISION_HOUR, TARGET_END, TARGET_START
from app.schemas import ForecastPoint, ForecastResponse

router = APIRouter(prefix="/api", tags=["forecast"])


@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    target_date: date = Query(..., description="Día de entrega, ej. 2026-01-15"),
    decision_hour: int = Query(DEFAULT_DECISION_HOUR, ge=0, le=23),
):
    day = pd.Timestamp(target_date, tz="UTC")
    lo, hi = pd.Timestamp(TARGET_START, tz="UTC"), pd.Timestamp(TARGET_END, tz="UTC")
    if not (lo <= day < hi):
        raise HTTPException(
            status_code=404,
            detail=f"target_date fuera de rango: {TARGET_START} a {TARGET_END} (fin exclusivo)",
        )

    df = get_dataset(decision_hour)
    d = df[(df["startTime"] >= day) & (df["startTime"] < day + pd.Timedelta(days=1))]
    cutoff = day - pd.Timedelta(days=1) + pd.Timedelta(hours=decision_hour)

    return ForecastResponse(
        target_date=target_date.isoformat(),
        decision_hour=decision_hour,
        decision_cutoff=cutoff.isoformat(),
        points=[
            ForecastPoint(
                time=r.startTime.isoformat(),
                forecast=r.forecast,
                actual=r.actual,
                error=r.error,
                horizon_h=r.horizon_h,
            )
            for r in d.itertuples()
        ],
    )