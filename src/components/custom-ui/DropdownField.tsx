"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoIosArrowDown } from "react-icons/io"
import { DropdownFieldProps } from "@/types/DropdownFieldProps"
import { Label } from "../ui/label"


export function DropdownField(props: DropdownFieldProps) {
    const {title, menu = [], label} = props
    return (
        <div className="flex flex-col gap-2">
        {label && <Label>{label}</Label>}
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="flex items-center gap-4 text-base">
                {title} <IoIosArrowDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {menu.map((item, index) => (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    )
}
