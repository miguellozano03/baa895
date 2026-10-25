import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ITEMS = [
  { title: "Decision cutoff", text: "For each delivery hour, we use the latest forecast published before the cutoff on the previous day (default 09:00 UTC, equal to local time in January). This is an assumption and can be changed in the header." },
  { title: "Scope of January", text: "Decisions made on 1-31 January 2026, i.e. delivery days from 2 January to 1 February." },
  { title: "Resolution", text: "Actuals are half-hourly and forecasts hourly, so actuals are averaged per hour." },
  { title: "Error definition", text: "error = forecast - actual. A positive error means the forecast overestimated wind generation." },
  { title: "Limitations", text: "Single month of data. The cause of the systematic overestimation was not confirmed." },
]

export default function MethodologyPage() {
  return (
    <div className="space-y-4">
      {ITEMS.map((i) => (
        <Card key={i.title}>
          <CardHeader>
            <CardTitle className="text-base">{i.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{i.text}</CardContent>
        </Card>
      ))}
    </div>
  )
}
