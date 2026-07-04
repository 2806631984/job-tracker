import { useApp } from '../store/AppContext';
import { computeStats } from '../utils/stats';
import StatCard from '../components/StatCard';
import {
  Briefcase, MessageSquare, TrendingUp, CheckCircle,
  Clock, Target, Send, XCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

export default function Dashboard() {
  const { state } = useApp();
  const stats = computeStats(state.jobs);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">数据看板</h2>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="总投递数" value={stats.total} icon={<Send size={18} />} color="#3b82f6" />
        <StatCard label="面试中" value={stats.interview} icon={<Target size={18} />} color="#06b6d4" />
        <StatCard label="已Offer" value={stats.offer} icon={<CheckCircle size={18} />} color="#10b981" />
        <StatCard label="已拒绝" value={stats.rejected} icon={<XCircle size={18} />} color="#ef4444" />
      </div>

      {/* 转化率卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="回复率" value={`${stats.replyRate}%`} icon={<MessageSquare size={18} />} color="#8b5cf6" />
        <StatCard label="面试转化率" value={`${stats.interviewRate}%`} icon={<TrendingUp size={18} />} color="#f59e0b" />
        <StatCard label="Offer率" value={`${stats.offerRate}%`} icon={<CheckCircle size={18} />} color="#22c55e" />
        <StatCard label="待处理" value={stats.wishlist + stats.applied} icon={<Clock size={18} />} color="#64748b" />
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 状态分布柱状图 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-700 mb-4">各状态分布</h3>
          {stats.total === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Briefcase size={40} className="mx-auto mb-3 opacity-40" />
              <p>还没有投递记录</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 近30天投递趋势 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-700 mb-4">近30天投递趋势</h3>
          {stats.total === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <TrendingUp size={40} className="mx-auto mb-3 opacity-40" />
              <p>还没有投递数据</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 本周/本月新增 */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-sm text-gray-500">本周新增投递</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{stats.thisWeek}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-sm text-gray-500">本月新增投递</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{stats.thisMonth}</div>
        </div>
      </div>
    </div>
  );
}
