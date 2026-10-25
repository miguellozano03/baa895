import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ForecastPoint, MetricsResponse } from "@/api/types"
import type { ForecastView } from "./types"

const config = {
  forecast: { label: "Forecast", color: "var(--chart-1)" },
  actual: { label: "Actual", color: "var(--chart-2)" },
  conservative: { label: "Conservative (forecast − P95)", color: "var(--chart-5)" },
} satisfies ChartConfig

interface Props {
  points: ForecastPoint[]
  view: ForecastView
  metrics: MetricsResponse | undefined
}

export default function ForecastChart({ points, view, metrics }: Props) {
  const rows = points.map((p) => ({
    hour: p.time.slice(11, 16), // "HH:mm" (UTC)
    forecast: view.biasAdjusted && metrics ? p.forecast - metrics.bias_mw : p.forecast,
    actual: view.showActual ? p.actual : null,
    conservative: view.safetyMargin && metrics ? p.forecast - metrics.err_p95 : null,
  }))

  return (
    <ChartContainer config={config} className="h-80 w-full">
      <LineChart data={rows}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="hour" tickLine={false} />
        <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="forecast" stroke="var(--color-forecast)" dot={false} strokeWidth={2} />
        <Line dataKey="actual" stroke="var(--color-actual)" dot={false} strokeWidth={2} />
        <Line dataKey="conservative" stroke="var(--color-conservative)" dot={false} strokeDasharray="5 5" />
      </LineChart>
    </ChartContainer>
  )
}
