export interface InputFieldProps {
    label?: string
    type: string
    placeholder: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
