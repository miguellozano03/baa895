import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FetchState } from "@/hooks/useFetch"

interface Props<T> {
  title: string
  description?: string
  query: FetchState<T>
  children: (data: T) => ReactNode
}

export default function ChartCard<T>({ title, description, query, children }: Props<T>) {
  const data = query.data
  const loading = query.isLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {loading || !data ? <div className="h-72 animate-pulse rounded-md bg-muted" /> : children(data)}
      </CardContent>
    </Card>
  )
}
