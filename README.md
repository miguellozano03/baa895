# UK Wind Forecast Accuracy

A decision-support prototype for a UK electricity utility's day-ahead procurement team. It brings Elexon's national wind-generation forecasts together with actual generation so users can inspect the forecast available before a delivery day and assess historical forecast error.

> **Prototype scope:** this application analyses wind generation only. It does not forecast consumer demand, model other generation or market positions, calculate a procurement requirement, or place trades. It is an analytical aid, not a substitute for a utility's operational or trading systems.

## Product overview

The day-ahead procurement team must make decisions before electricity is delivered. Wind generation is uncertain, so the team needs both a clear view of the forecast available at decision time and a quantitative view of how forecasts have performed.

The app supports that workflow with three views:

- **Decision view:** choose a delivery day and decision cutoff hour; compare the selected wind forecast with actual generation. Optional overlays show a bias-adjusted forecast and a P95 safety margin.
- **Forecast accuracy:** inspect aggregate error metrics, error by delivery hour, and error by forecast lead time.
- **Methodology:** review the period, cutoff, hourly aggregation, error definition, and known limitations.

Together, these views help users understand the wind forecast and its historical error before making a procurement decision. They do not recommend how much additional power to buy: that would also require demand, other generation, and the utility's market position, which are outside the requested data scope.

## Data and analysis

The prototype uses national-level data from Elexon's BMRS API only:

- [FUELHH stream](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream), filtered to `fuelType=WIND`, for actual generation.
- [WINDFOR stream](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream), for wind forecasts.

The ingestion script currently requests actuals from **2026-01-01 through 2026-02-06** and forecasts from **2025-12-20 through 2026-02-01**. These wider windows provide the data needed for the target period; the analysis is limited to decisions made on **January 1–31, 2026**, for delivery days **January 2–February 1, 2026**.

Analysis conventions:

1. All timestamps and decision cutoffs are interpreted in UTC. The default cutoff is **09:00 UTC on the day before delivery** (also 09:00 UK local time during January, when the UK is on GMT). Users can select another cutoff hour in the app.
2. Actuals are at 30-minute resolution and are averaged into hourly values. Forecasts are hourly.
3. For each delivery hour, the decision view selects the latest forecast published **at or before** the chosen cutoff. This avoids using information that would not yet have been available.
4. Error is `forecast - actual`; a positive value means wind generation was overforecast.
5. Lead-time metrics use all forecasts with a positive horizon for the target delivery days, not only the forecast selected for the decision view.

The available history is one month of decisions. It is useful for an initial review, but is not enough by itself to establish that forecast bias will persist or to support a production trading strategy.

## Architecture

```text
Elexon BMRS API
      |
      | backend/scripts/ingest.py
      v
backend/data/*.parquet
      |
      | FastAPI loads and processes cached data
      v
FastAPI JSON API  <---- HTTP ---->  React + TypeScript + Vite UI
```

- **Frontend:** React, TypeScript, Vite, and Recharts, in [`frontend/`](./frontend/).
- **Backend:** Python, FastAPI, pandas, and Parquet, in [`backend/app/`](./backend/app/).
- **Analysis:** forecast selection and dataset construction are in [`backend/app/analysis/forecasts.py`](./backend/app/analysis/forecasts.py); metric calculations are in [`backend/app/analysis/metrics.py`](./backend/app/analysis/metrics.py).
- **Data ingestion:** [`backend/scripts/ingest.py`](./backend/scripts/ingest.py) fetches data and writes `actuals.parquet` and `forecasts.parquet` under `backend/data/`.
- **API endpoints:** `GET /api/health`, `GET /api/forecast`, `GET /api/metrics`, `GET /api/metrics/by-hour`, and `GET /api/metrics/by-horizon`. FastAPI's interactive API documentation is available at `/docs` while the backend is running.

The backend reads the Parquet files when data is first requested and caches the loaded datasets and derived datasets in process memory. Re-ingesting data requires restarting the backend to clear those caches.

## Run locally

### Requirements

- Python 3.10 or newer.
- Node.js and npm compatible with the Vite version in `frontend/package.json`.
- Network access to Elexon's BMRS API for the initial data download.

### 1. Install backend dependencies and download data

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m scripts.ingest
```

On Windows PowerShell, activate the environment with:

```powershell
.\.venv\Scripts\Activate.ps1
```

The ingestion command creates `backend/data/actuals.parquet` and `backend/data/forecasts.parquet`. Run it again when you need to refresh the local data. The requested historical dates are currently constants in [`backend/app/config.py`](./backend/app/config.py).

### 2. Start the backend

From the `backend/` directory, with the virtual environment active:

```bash
CORS_ORIGINS=http://localhost:5173 uvicorn app.main:app --reload --port 8000
```

The backend reads `CORS_ORIGINS` from the process environment. [`backend/.env.example`](./backend/.env.example) documents the local value, but the app does not automatically load `.env` files.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The frontend defaults to `http://localhost:8000` for the API. To override it, create `frontend/.env.local` with:

```dotenv
VITE_API_URL=http://localhost:8000
```

The backend must be running and the Parquet files must exist before the app can return forecast and metric data.

## Key metrics

- **MAE:** mean absolute error in MW.
- **RMSE:** root mean squared error in MW, which gives larger errors more weight.
- **Bias:** mean signed error in MW; positive values indicate overforecasting.
- **Bias (%):** total signed error divided by total actual generation.
- **Unbiased MAE/RMSE:** error metrics after subtracting the mean bias, to show error remaining after a constant bias correction.
- **P50/P90/P99 absolute error and P5/P95 signed error:** summaries of the error distribution.
- **By hour:** bias and MAE grouped by delivery hour.
- **By lead time:** bias, MAE, and sample count across lead-time bins.

## Current delivery status and limitations

- The React frontend and Python API are implemented for local use.
- The app uses historical Elexon data for the stated January 2026 decision period; it is not a live forecasting or procurement service.
- Docker support is **not currently configured** in this repository.
- The app has **not been deployed** to Vercel, Heroku, or another hosting provider.
- The current analysis is national wind generation only; there is no demand forecast, non-wind supply, price, portfolio, or procurement recommendation.
- The existing backend test file is still a scaffold with `TODO` test bodies; meaningful automated test coverage remains to be added.
- Before operational use, validate the source data and assumptions with the client, expand the evaluation period, and add appropriate monitoring, deployment, security, and decision controls.

## AI assistance

AI coding assistance was used during development, including GitHub Copilot in VS Code, to inspect the project, make code and documentation changes, and support implementation. The resulting code and analysis assumptions still require review and validation by the project team.
