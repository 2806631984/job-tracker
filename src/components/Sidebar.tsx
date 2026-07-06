import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, MessageSquare, Tags, PlusCircle, LogOut, X,
  Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '数据看板' },
  { to: '/jobs', icon: Briefcase, label: '岗位列表' },
  { to: '/jobs/new', icon: PlusCircle, label: '新增岗位' },
  { to: '/templates', icon: MessageSquare, label: '打招呼模板' },
  { to: '/tags', icon: Tags, label: '分类标签' },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { dark, toggle } = useDarkMode();

  return (
    <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shrink-0">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Briefcase size={22} className="text-blue-600 dark:text-blue-400" />
            投简历助手
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">记录每一次投递</p>
        </div>
        {/* 手机端关闭按钮 */}
        {onNavigate && (
          <button onClick={onNavigate} className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <span className="truncate">{user?.email}</span>
        </div>
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? '浅色模式' : '深色模式'}
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </aside>
  );
}
