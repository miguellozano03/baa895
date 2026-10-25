export interface ForecastPoint {
  time: string
  forecast: number
  actual: number | null
  error: number | null
  horizon_h: number
}

export interface ForecastResponse {
  target_date: string
  decision_hour: number
  decision_cutoff: string
  points: ForecastPoint[]
}

export interface MetricsResponse {
  n: number
  mae: number
  rmse: number
  bias_mw: number
  bias_pct: number
  mae_pct_of_mean_actual: number
  mae_unbiased: number
  rmse_unbiased: number
  abs_err_p50: number
  abs_err_p90: number
  abs_err_p99: number
  err_p5: number
  err_p95: number
}

export interface ByHourRow {
  hour: number
  bias: number
  mae: number
}

export interface ByHorizonRow {
  horizon_bin: string
  bias: number
  mae: number
  n: number
}