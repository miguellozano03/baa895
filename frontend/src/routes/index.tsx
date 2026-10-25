import { createBrowserRouter } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import { DecisionPage, AccuracyPage, MethodologyPage } from "@/pages"
import { ROUTES } from "./paths"

export { ROUTES }

export const router = createBrowserRouter([
  {
    path: ROUTES.decision,
    element: <AppLayout />,
    children: [
      { index: true, element: <DecisionPage /> },
      { path: "accuracy", element: <AccuracyPage /> },
      { path: "methodology", element: <MethodologyPage /> },
    ],
  },
])
