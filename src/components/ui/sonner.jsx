import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      // 1. Keep your custom icons
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-400" />,
        info: <InfoIcon className="size-5 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-400" />,
        error: <OctagonXIcon className="size-5 text-red-400" />,
        loading: <Loader2Icon className="size-5 animate-spin text-zinc-400" />,
      }}
      // 2. Add Tailwind Styling (This fixes the visibility issue)
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900/90 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-xl font-body",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          
          // Specific styling for types
          error: "group-[.toaster]:border-red-900/50 group-[.toaster]:bg-red-950/30",
          success: "group-[.toaster]:border-green-900/50 group-[.toaster]:bg-green-950/30",
          warning: "group-[.toaster]:border-yellow-900/50 group-[.toaster]:bg-yellow-950/30",
          info: "group-[.toaster]:border-blue-900/50 group-[.toaster]:bg-blue-950/30",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }