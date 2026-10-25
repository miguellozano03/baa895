export const mw = (v: number) => `${Math.round(v).toLocaleString("en-GB")} MW`
export const pct = (v: number) => `${v.toFixed(1)}%`
export const signed = (v: number) =>
  `${v > 0 ? "+" : ""}${Math.round(v).toLocaleString("en-GB")} MW`
