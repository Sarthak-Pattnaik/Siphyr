
interface HeaderBarProps {
    setSidebarOpen: (open: boolean) => void;
}

export default function HeaderBar({ setSidebarOpen }: HeaderBarProps) {
    return (
        <div>
            <header className="bg-purple-500 border-t-2 border-gray-800 px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Siphyr</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>
        </div>
    );
}