import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MetricsResponse } from "@/api/types"
import { mw, pct } from "@/lib/format"

export default function Takeaway({ metrics: m }: { metrics: MetricsResponse }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Takeaway</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          In January 2026 the day-ahead wind forecast overestimated generation by about{" "}
          <strong>{pct(m.bias_pct)}</strong>, with a typical error of <strong>{mw(m.mae)}</strong>.
        </p>
        <p>
          Correcting the average bias would cut the error to <strong>{mw(m.mae_unbiased)}</strong>. Holding a
          margin of <strong>{mw(m.err_p95)}</strong> covers 95% of hours and reduces the risk of buying too little.
        </p>
        <p className="text-xs text-muted-foreground">
          Based on a single month. The cause of the overestimation was not confirmed.
        </p>
      </CardContent>
    </Card>
  )
}
