import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, MessageSquare, Tags, PlusCircle,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '数据看板' },
  { to: '/jobs', icon: Briefcase, label: '岗位列表' },
  { to: '/jobs/new', icon: PlusCircle, label: '新增岗位' },
  { to: '/templates', icon: MessageSquare, label: '打招呼模板' },
  { to: '/tags', icon: Tags, label: '分类标签' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Briefcase size={22} className="text-blue-600" />
          投简历助手
        </h1>
        <p className="text-xs text-gray-400 mt-1">记录每一次投递</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
        数据存储在本地浏览器
      </div>
    </aside>
  );
}
