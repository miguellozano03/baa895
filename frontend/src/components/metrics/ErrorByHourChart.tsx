import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ByHourRow } from "@/api/types"

const config = {
  bias: { label: "Bias", color: "var(--chart-1)" },
  mae: { label: "MAE", color: "var(--chart-3)" },
} satisfies ChartConfig

export default function ErrorByHourChart({ data }: { data: ByHourRow[] }) {
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="hour" tickLine={false} />
        <YAxis width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="bias" fill="var(--color-bias)" radius={2} />
        <Bar dataKey="mae" fill="var(--color-mae)" radius={2} />
      </BarChart>
    </ChartContainer>
  )
}
