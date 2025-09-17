import React from 'react';
import InputError from './InputError';
import InputLabel from './InputLabel';

export default function TextArea({
    id,
    label,
    value,
    className = '',
    error,
    onChange,
    required = false,
    disabled = false,
    rows = 4,
    placeholder = '',
    autoComplete = '',
    icon: Icon, // Destructure with capital I to use as component
    ...props
}) {
    return (
        <div className="space-y-2">
            {label && (
                <InputLabel htmlFor={id} value={label} required={required} icon={Icon} />
            )}
            
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    rows={rows}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'} ${
                        Icon ? 'pl-10' : ''
                    } ${className}`}
                    {...props}
                />
            </div>
            
            {error && <InputError message={error} />}
        </div>
    );
}