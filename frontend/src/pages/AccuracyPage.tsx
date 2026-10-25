import { useDecisionHour } from "@/hooks/useDecisionHour"
import { useMetrics, useByHour, useByHorizon } from "@/hooks/useApi"
import { ChartCard } from "@/components/shared"
import {
  MetricsGrid, ErrorByHourChart, ErrorByHorizonChart, Takeaway,
} from "@/components/metrics"

export default function AccuracyPage() {
  const [hour] = useDecisionHour()
  const metrics = useMetrics(hour)
  const byHour = useByHour(hour)
  const byHorizon = useByHorizon()

  return (
    <>
      <MetricsGrid query={metrics} />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Error by hour of day" description="Bias and MAE per delivery hour (MW)" query={byHour}>
          {(data) => <ErrorByHourChart data={data} />}
        </ChartCard>
        <ChartCard title="Error by lead time" description="All forecasts published before the target hour (MW)" query={byHorizon}>
          {(data) => <ErrorByHorizonChart data={data} />}
        </ChartCard>
      </div>
      {metrics.data && <Takeaway metrics={metrics.data} />}
    </>
  )
}
