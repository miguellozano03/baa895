import { NavLink, Outlet, useLocation } from "react-router-dom"
import { Wind } from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useDecisionHour } from "@/hooks/useDecisionHour"
import { ROUTES } from "@/routes/paths"

const NAV = [
  { to: ROUTES.decision, label: "Decision view", end: true },
  { to: ROUTES.accuracy, label: "Forecast accuracy", end: false },
  { to: ROUTES.methodology, label: "Methodology", end: false },
]

const HOURS = Array.from({ length: 24 }, (_, h) => h)

export default function AppLayout() {
  const [hour, setHour] = useDecisionHour()
  const { search } = useLocation() // conserva ?hour=9 al cambiar de página

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Wind className="size-5" /> UK Wind Forecast Accuracy
          </div>

          <nav className="flex gap-1">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={{ pathname: to, search }}
                end={end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Decision cutoff (UTC)</span>
            <Select value={String(hour)} onValueChange={(v) => setHour(Number(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {String(h).padStart(2, "0")}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-4">
        <Outlet />
      </main>
    </div>
  )
}
