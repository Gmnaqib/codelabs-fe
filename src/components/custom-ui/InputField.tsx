import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { InputFieldProps } from '@/types/InputFieldProps'

const InputField = (props: InputFieldProps) => {
    const {label, type, placeholder} = props
    return (
        <div className='flex flex-col gap-2'>
            {label && <Label>{label}</Label>}
            <Input type={type} placeholder={placeholder} />
        </div>
    )
}

export default InputField
