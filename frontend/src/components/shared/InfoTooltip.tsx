import type { ReactNode } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InfoTooltip({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="More info"
        className="inline-flex cursor-help"
      >
        <Info className="size-3.5 text-muted-foreground" />
      </TooltipTrigger>

      <TooltipContent className="max-w-64">{children}</TooltipContent>
    </Tooltip>
  );
}
