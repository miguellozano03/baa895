import { useSearchParams } from "react-router-dom"

export function useDecisionHour(): [number, (h: number) => void] {
  const [params, setParams] = useSearchParams()
  const hour = Number(params.get("hour") ?? 9)

  const setHour = (h: number) =>
    setParams(
      (p) => {
        p.set("hour", String(h))
        return p
      },
      { replace: true },
    )

  return [hour, setHour]
}
