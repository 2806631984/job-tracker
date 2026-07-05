import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 桌面侧边栏 */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 手机侧边栏（滑动覆盖） */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* 侧边栏 */}
          <div className="absolute left-0 top-0 bottom-0 w-56 shadow-xl">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* 手机顶部栏 */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} className="text-gray-700" />
          </button>
          <span className="font-semibold text-gray-800 text-sm">投简历助手</span>
        </div>
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
