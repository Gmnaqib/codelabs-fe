export interface InputFieldProps {
    label?: string
    type: string
    placeholder: string
    value?: string
    size?: "sm" | "md"
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
}
