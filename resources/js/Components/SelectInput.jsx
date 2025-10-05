import React from 'react';
import InputError from '@/Components/InputError';

export default function SelectInput({ id, value, onChange, className = '', options, ...props }) {
    return (
        <div>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <InputError message={props.error} className="mt-2" />
        </div>
    );
}