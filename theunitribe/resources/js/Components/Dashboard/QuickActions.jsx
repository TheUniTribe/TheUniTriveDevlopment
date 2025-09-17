import { Card } from './Card';

export function QuickActions({ actions }) {
    const getIcon = (iconName) => {
        // Replace with actual icons from your icon library
        switch(iconName) {
            case 'users': return '👥';
            case 'shield': return '🛡️';
            case 'cog': return '⚙️';
            case 'chart-bar': return '📊';
            default: return '✨';
        }
    };

    return (
        <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <a
                        key={index}
                        href={action.href}
                        className={`flex flex-col items-center justify-center rounded-lg p-4 text-center transition-colors hover:bg-gray-50 ${action.color}`}
                    >
                        <span className="text-2xl">{getIcon(action.icon)}</span>
                        <span className="mt-2 text-sm font-medium">{action.title}</span>
                    </a>
                ))}
            </div>
        </Card>
    );
}
