import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ByHorizonRow } from "@/api/types"

const config = {
  bias: { label: "Bias", color: "var(--chart-1)" },
  mae: { label: "MAE", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function ErrorByHorizonChart({ data }: { data: ByHorizonRow[] }) {
  return (
    <div className="space-y-2">
      <ChartContainer config={config} className="h-72 w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="horizon_bin" tickLine={false} />
          <YAxis width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="bias" fill="var(--color-bias)" radius={2} />
          <Bar dataKey="mae" fill="var(--color-mae)" radius={2} />
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">
        Hours ahead of delivery. 0-12 h is informative only: the day-ahead decision uses roughly 16-40 h.
        Rows are not independent (the same hour appears once per publication).
      </p>
    </div>
  )
}
