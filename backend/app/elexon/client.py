import pandas as pd
import requests

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"

def get_actuals(start: str, end: str) -> pd.DataFrame:
    """Generación eólica real (FUELHH, fuelType=WIND). Fechas 'YYYY-MM-DD'."""
    r = requests.get(
        f"{BASE_URL}/FUELHH/stream",
        params={
            "settlementDateFrom": start,
            "settlementDateTo": end,
            "fuelType": "WIND",
        },
        timeout=120,
    )
    r.raise_for_status()
    df = pd.DataFrame(r.json())
    df["startTime"] = pd.to_datetime(df["startTime"], utc=True)
    return df[["startTime", "generation"]]



def get_forecasts(start: str, end: str) -> pd.DataFrame:
    """Pronósticos eólicos (WINDFOR). Fechas ISO, ej. '2025-12-20T00:00Z'."""
    r = requests.get(
        f"{BASE_URL}/WINDFOR/stream",
        params={
            "publishDateTimeFrom": start,
            "publishDateTimeTo": end,
        },
        timeout=120,
    )
    r.raise_for_status()
    df = pd.DataFrame(r.json())
    df["startTime"] = pd.to_datetime(df["startTime"], utc=True)
    df["publishTime"] = pd.to_datetime(df["publishTime"], utc=True)
    return df[["startTime", "publishTime", "generation"]]