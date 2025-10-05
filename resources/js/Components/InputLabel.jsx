export default function InputLabel({
    value,
    className = '',
    children,
    icon,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 flex items-center gap-1 ` +
                className
            }
        >
            {icon && <span>{icon}</span>}
            {value ? value : children}
        </label>
    );
}
