import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { ForecastView } from "./types"

interface Props {
  date: string
  onDateChange: (d: string) => void
  view: ForecastView
  onViewChange: (v: ForecastView) => void
}

const TOGGLES: { key: keyof ForecastView; label: string }[] = [
  { key: "showActual", label: "Show actual" },
  { key: "biasAdjusted", label: "Bias-adjusted" },
  { key: "safetyMargin", label: "Safety margin (P95)" },
]

export default function ForecastControls({ date, onDateChange, view, onViewChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <label className="space-y-1 text-sm">
        <span className="text-muted-foreground">Delivery day</span>
        <Input
          type="date"
          min="2026-01-02"
          max="2026-02-01"
          value={date}
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
          className="w-44"
        />
      </label>

      {TOGGLES.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2 text-sm">
          <Switch
            checked={view[key]}
            onCheckedChange={(v) => onViewChange({ ...view, [key]: v })}
          />
          {label}
        </label>
      ))}
    </div>
  )
}
