import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline:
          "border-border/60 text-foreground/80 bg-background/40 backdrop-blur-sm",
        accent:
          "border-[#73e6ce]/30 bg-[#73e6ce]/10 text-[#73e6ce]",
        purple:
          "border-[#9d7cff]/30 bg-[#9d7cff]/10 text-[#9d7cff]",
        pulse:
          "border-border/50 bg-background/60 text-foreground/80 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, children, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
