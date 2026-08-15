import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(226,64%,20%)] text-white hover:bg-[hsl(226,64%,15%)] shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[hsl(220,18%,88%)] bg-white text-[hsl(226,64%,20%)] hover:bg-[hsl(36,25%,95%)] hover:text-[hsl(226,64%,15%)] font-medium",
        secondary:
          "bg-[hsl(252,60%,94%)] text-[hsl(252,50%,45%)] hover:bg-[hsl(252,60%,90%)] font-medium",
        ghost: "text-[hsl(226,50%,20%)] hover:bg-[hsl(36,20%,95%)] hover:text-[hsl(226,64%,20%)]",
        link: "text-[hsl(226,64%,20%)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
