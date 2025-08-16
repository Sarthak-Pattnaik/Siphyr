
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DirectMessagesSidebar({ isOpen, onClose }: Props) {
  return (
    <>
      {/* Desktop direct messages sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Direct Messages</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Direct message contacts */}
          <div className="space-y-3">
            {/* Contact 1 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">J</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500 truncate">Hey, how are you doing?</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">2m ago</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 2 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Sarah Smith</p>
                <p className="text-sm text-gray-500 truncate">Meeting at 3 PM today</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">15m ago</span>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 3 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Mike Johnson</p>
                <p className="text-sm text-gray-500 truncate">Thanks for the help!</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">1h ago</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 4 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">E</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Emma Wilson</p>
                <p className="text-sm text-gray-500 truncate">Can you review this?</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">2h ago</span>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 5 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">David Brown</p>
                <p className="text-sm text-gray-500 truncate">Project update ready</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">3h ago</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile direct messages sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Direct Messages</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          {/* Direct message contacts */}
          <div className="space-y-3">
            {/* Contact 1 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">J</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500 truncate">Hey, how are you doing?</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">2m ago</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 2 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Sarah Smith</p>
                <p className="text-sm text-gray-500 truncate">Meeting at 3 PM today</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">15m ago</span>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 3 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Mike Johnson</p>
                <p className="text-sm text-gray-500 truncate">Thanks for the help!</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">1h ago</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 4 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">E</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">Emma Wilson</p>
                <p className="text-sm text-gray-500 truncate">Can you review this?</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">2h ago</span>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            
            {/* Contact 5 */}
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">David Brown</p>
                <p className="text-sm text-gray-500 truncate">Project update ready</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-gray-400">3h ago</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
