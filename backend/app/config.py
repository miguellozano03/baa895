from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Rango de descarga (más ancho que "enero" para cubrir pronósticos previos)
ACTUALS_START, ACTUALS_END = "2026-01-01", "2026-02-06"
FORECASTS_START, FORECASTS_END = "2025-12-20T00:00Z", "2026-02-01T00:00Z"

# Días objetivo cuyas decisiones se toman en enero (D-1 entre 1 y 31 de enero)
TARGET_START, TARGET_END = "2026-01-02", "2026-02-02"   # fin exclusivo

DEFAULT_DECISION_HOUR = 9   # UTC (= hora local en enero, GMT). SUPUESTO: documentar