import { useState } from "react"
import { useDecisionHour } from "@/hooks/useDecisionHour"
import { useForecast, useMetrics } from "@/hooks/useApi"
import { ChartCard } from "@/components/shared"
import {
  ForecastChart, ForecastControls, CutoffBanner, type ForecastView,
} from "@/components/forecast"

export default function DecisionPage() {
  const [hour] = useDecisionHour()
  const [targetDate, setTargetDate] = useState("2026-01-15")
  const [view, setView] = useState<ForecastView>({
    showActual: true,
    biasAdjusted: false,
    safetyMargin: true,
  })

  const forecast = useForecast(targetDate, hour)
  const metrics = useMetrics(hour) // bias and err_p95 for the derived lines

  return (
    <>
      <ForecastControls
        date={targetDate}
        onDateChange={setTargetDate}
        view={view}
        onViewChange={setView}
      />
      {forecast.data && <CutoffBanner cutoff={forecast.data.decision_cutoff} />}
      <ChartCard
        title="Forecast vs actual"
        description="Hourly wind generation for the delivery day (MW)"
        query={forecast}
      >
        {(data) => <ForecastChart points={data.points} view={view} metrics={metrics.data} />}
      </ChartCard>
    </>
  )
}
