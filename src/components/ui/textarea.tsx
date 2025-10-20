import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { TextareaProps } from "@/types/TextareaProps"

function Textarea({ className, label, id, ...props }: TextareaProps) {
  const textareaId = React.useId()

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <Label htmlFor={id ?? textareaId}>{label}</Label>}
      <textarea
        id={id ?? textareaId}
        data-slot="textarea"
        className={cn(
          "border-muted-foreground rounded-2xl placeholder:text-muted-foreground focus-visible:border-primary dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }
