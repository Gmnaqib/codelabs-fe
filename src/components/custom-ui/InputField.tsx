import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { InputFieldProps } from '@/types/InputFieldProps'

const InputField = (props: InputFieldProps) => {
    const {label, type, placeholder, value, onChange} = props
    return (
        <div className='flex flex-col gap-2'>
            {label && <Label>{label}</Label>}
            <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}

export default InputField
