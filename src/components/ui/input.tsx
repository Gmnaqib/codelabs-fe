import * as React from "react"
import { cn } from "@/lib/utils"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: "sm" | "md"
}

function Input({
  className,
  type,
  size = "md",
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "bg-white text-black placeholder:text-neutral w-full min-w-0 rounded-full border border-muted-foreground outline-none transition",

          // SIZE SYSTEM
          size === "sm" && "h-10 pl-5",
          size === "md" && "h-12 px-6",

          "focus-visible:ring-2 focus-visible:ring-primary/50",
          className
        )}
        {...props}
      />

      {size === "sm" && (
        <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"/>
      )}
    </div>
  )
}

export { Input }
