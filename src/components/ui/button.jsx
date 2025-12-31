import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // BASE STYLES: Added 'font-body' (Rajdhani), 'uppercase', 'tracking-wider', 'rounded-lg'
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold font-body uppercase tracking-wider ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(180_100%_50%_/_0.5)]",
        
        destructive: 
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        // OUTLINE: Matches Lovable (Neon Outline)
        outline: 
          "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_hsl(180_100%_50%_/_0.3)]",
        
        secondary: 
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_20px_hsl(320_100%_60%_/_0.5)]",
        
        ghost: 
          "text-foreground hover:bg-muted hover:text-primary",
        
        link: 
          "text-primary underline-offset-4 hover:underline",
        
        // CYBER: Matches Lovable (Gradient + Shimmer Animation)
        cyber: 
          "relative overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground hover:shadow-[0_0_30px_hsl(180_100%_50%_/_0.6)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        
        // GLOW: Extra variant from Lovable
        glow: 
          "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:shadow-[0_0_25px_hsl(180_100%_50%_/_0.6)]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        
        // XL: Matches Lovable Hero Buttons
        xl: "h-14 rounded-lg px-10 text-lg",
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