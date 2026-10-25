"""Download data from Elexon and save it to data/. Run once: python -m scripts.ingest."""
import logging

from app.config import (
    ACTUALS_START, ACTUALS_END,
    FORECASTS_START, FORECASTS_END,
    DATA_DIR
)
from app.elexon.client import get_actuals, get_forecasts


logger = logging.getLogger(__name__)


def main():

    DATA_DIR.mkdir(exist_ok=True)

    actuals = get_actuals(ACTUALS_START, ACTUALS_END)
    forecasts = get_forecasts(FORECASTS_START, FORECASTS_END)

    actuals.to_parquet(DATA_DIR / "actuals.parquet", index=False)
    forecasts.to_parquet(DATA_DIR / "forecasts.parquet", index=False)

    logger.info(
        "actuals:   %s filas | %s -> %s",
        f"{len(actuals):,}",
        actuals["startTime"].min(),
        actuals["startTime"].max()
    )


    logger.info(
        "forecasts: %s filas | publishTime %s -> %s",
        f"{len(forecasts):,}",
        forecasts["publishTime"].min(),
        forecasts["publishTime"].max()
    )


    logger.info(
        "startTime   %s -> %s",
        forecasts["startTime"].min(),
        forecasts["startTime"].max()
    )


if __name__ == "__main__":
    main()