import { Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CutoffBanner({ cutoff }: { cutoff: string }) {
  const when = new Date(cutoff).toLocaleString("en-GB", {
    timeZone: "UTC", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  })
  return (
    <Alert>
      <Clock className="size-4" />
      <AlertDescription>
        Decision made on {when} UTC, using the latest forecast published before that moment.
      </AlertDescription>
    </Alert>
  )
}
