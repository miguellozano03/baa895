from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Download range (wider than January to include earlier forecasts)
ACTUALS_START, ACTUALS_END = "2026-01-01", "2026-02-06"
FORECASTS_START, FORECASTS_END = "2025-12-20T00:00Z", "2026-02-01T00:00Z"

# Target days with decisions made in January (D-1 from January 1 through January 31)
TARGET_START, TARGET_END = "2026-01-02", "2026-02-02"   # exclusive end

DEFAULT_DECISION_HOUR = 9   # UTC (= local time in January, GMT). ASSUMPTION: document this.