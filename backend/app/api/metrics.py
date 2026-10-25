from fastapi import APIRouter, Query

from app.analysis import metrics as m
from app.api.deps import get_dataset, get_raw
from app.config import DEFAULT_DECISION_HOUR
from app.schemas import ByHorizonRow, ByHourRow, MetricsResponse

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

DecisionHour = Query(DEFAULT_DECISION_HOUR, ge=0, le=23)


@router.get("", response_model=MetricsResponse)
def get_summary(decision_hour: int = DecisionHour):
    return m.summary(get_dataset(decision_hour))


@router.get("/by-hour", response_model=list[ByHourRow])
def get_by_hour(decision_hour: int = DecisionHour):
    return m.by_hour(get_dataset(decision_hour)).to_dict("records")


@router.get("/by-horizon", response_model=list[ByHorizonRow])
def get_by_horizon():
    fc, act = get_raw()
    return m.by_horizon(fc, act).to_dict("records")