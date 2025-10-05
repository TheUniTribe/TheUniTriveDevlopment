export function StatsGrid({ stats }) {
    const getIcon = (iconName) => {
        // You would replace this with actual icons from your icon library
        switch(iconName) {
            case 'users': return '👥';
            case 'activity': return '📊';
            case 'tasks': return '✅';
            case 'health': return '❤️';
            default: return '📈';
        }
    };

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <div className="flex items-center">
                        <div className="mr-4 rounded-md bg-gray-100 p-3 text-2xl">
                            {getIcon(stat.icon)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                                {stat.change} from last week
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}