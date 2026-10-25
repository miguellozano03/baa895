import type { MetricsResponse } from "@/api/types"
import type { FetchState } from "@/hooks/useFetch"
import { mw, pct, signed } from "@/lib/format"
import MetricCard from "./MetricCard"

export default function MetricsGrid({ query }: { query: FetchState<MetricsResponse> }) {
  const m = query.data
  const loading = query.isLoading

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        title="MAE"
        loading={loading}
        value={m && mw(m.mae)}
        sub={m && `${pct(m.mae_pct_of_mean_actual)} of average generation`}
        help="Mean absolute error: how far off the forecast is on a typical hour, in either direction."
      />
      <MetricCard
        title="Bias"
        loading={loading}
        value={m && signed(m.bias_mw)}
        sub={m && `${pct(m.bias_pct)} of actual generation`}
        help="Average signed error. Positive means the forecast promised more wind than was generated."
      />
      <MetricCard
        title="P95 over-forecast"
        loading={loading}
        value={m && mw(m.err_p95)}
        sub="95% of hours were better than this"
        help="In 95% of hours the forecast did not overestimate by more than this. Useful as a safety margin."
      />
      <MetricCard
        title="MAE (bias removed)"
        loading={loading}
        value={m && mw(m.mae_unbiased)}
        sub={m && `${pct((1 - m.mae_unbiased / m.mae) * 100)} lower than raw MAE`}
        help="Error left after subtracting the average bias. The part that a constant correction cannot fix."
      />
    </div>
  )
}
