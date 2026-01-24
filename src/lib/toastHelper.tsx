// src/lib/toastHelper.tsx
"use client"

import { toast } from "sonner"
import { IoCloseCircle } from "react-icons/io5"
import { CircleCheck } from "lucide-react"
import React from "react"
import { ToastOptionsProps } from "@/types/ToastOptionsProps"

export function showErrorToast(message: string, opts?: ToastOptionsProps) {
  toast(message, {
    icon:
      opts?.icon ??
      <IoCloseCircle className="size-4 text-white" />,
    description: opts?.description,
    duration: opts?.duration,
    style: {
      backgroundColor: opts?.style?.backgroundColor ?? "#CB3A31",
      color: opts?.style?.color ?? "#ffffff",
      ...opts?.style,
    },
  })
}

export function showSuccessToast(message: string, opts?: ToastOptionsProps) {
  toast(message, {
    icon:
      opts?.icon ??
      <CircleCheck className="size-4 text-white" />,
    description: opts?.description,
    duration: opts?.duration,
    style: {
      backgroundColor: opts?.style?.backgroundColor ?? "#43936C",
      color: opts?.style?.color ?? "#ffffff",
      ...opts?.style,
    },
  })
}
