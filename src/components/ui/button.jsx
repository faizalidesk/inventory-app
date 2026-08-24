import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-zinc-900 border border-zinc-200/90 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 dark:bg-card dark:text-foreground dark:border-border/80 dark:hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98]",
        primary:
          "bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-border/80 bg-background/60 backdrop-blur-md hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground text-muted-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        glow:
          "bg-gradient-to-r from-[#9d7cff] to-[#73e6ce] text-[#08080b] font-bold shadow-lg shadow-[#9d7cff]/25 hover:shadow-[#9d7cff]/40 hover:scale-[1.03] active:scale-[0.98]",
        glass:
          "bg-white/5 border border-white/10 text-foreground backdrop-blur-md hover:bg-white/10 hover:border-white/20",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-bold",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
