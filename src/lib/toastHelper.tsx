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
      <IoCloseCircle className="size-4 text-red-600" />,
    description: opts?.description,
    duration: opts?.duration,
    className:
      opts?.className ??
      "bg-red-500 border border-red-200 text-red-800",
    style: opts?.style,
  })
}

export function showSuccessToast(message: string, opts?: ToastOptionsProps) {
  toast(message, {
    icon:
      opts?.icon ??
      <CircleCheck className="size-4 text-green-600" />,
    description: opts?.description,
    duration: opts?.duration,
    className:
      opts?.className ??
      "bg-green-50 border border-green-200 text-green-800",
    style: opts?.style,
  })
}
