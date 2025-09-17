export function Card({ title, children, className = '' }) {
    return (
        <div className={`rounded-lg bg-white shadow ${className}`}>
            {title && (
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}