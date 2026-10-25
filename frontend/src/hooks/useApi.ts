import { useFetch } from "./useFetch";
import { api } from "@/api/client";
import type {
  ByHorizonRow,
  ByHourRow,
  ForecastResponse,
  MetricsResponse,
} from "@/api/types";

export const useForecast = (targetDate: string, hour: number) =>
  useFetch<ForecastResponse>(
    (signal) =>
      api(
        "/api/forecast",
        { target_date: targetDate, decision_hour: hour },
        signal,
      ),
    [targetDate, hour],
    !!targetDate,
  );

export const useMetrics = (hour: number) =>
  useFetch<MetricsResponse>(
    (signal) => api("/api/metrics", { decision_hour: hour }, signal),
    [hour],
  );

export const useByHour = (hour: number) =>
  useFetch<ByHourRow[]>(
    (signal) => api("/api/metrics/by-hour", { decision_hour: hour }, signal),
    [hour],
  );

export const useByHorizon = () =>
  useFetch<ByHorizonRow[]>(
    (signal) => api("/api/metrics/by-horizon", {}, signal),
    [],
  );
