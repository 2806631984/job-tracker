import type { Job } from '../types';

export interface DashboardStats {
  total: number;
  wishlist: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  accepted: number;
  rejected: number;
  replyRate: number;       // 有回复的占比（有timeline事件且非applied的岗位）
  interviewRate: number;   // 面试转化率（进入面试 / 总投递）
  offerRate: number;       // Offer率
  thisWeek: number;
  thisMonth: number;
  statusDistribution: { name: string; value: number; color: string }[];
  dailyTrend: { date: string; count: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  wishlist: '想投',
  applied: '已投递',
  screening: '筛选中',
  interview: '面试中',
  offer: '已Offer',
  accepted: '已入职',
  rejected: '已拒绝',
};

const STATUS_COLORS: Record<string, string> = {
  wishlist: '#8b5cf6',
  applied: '#3b82f6',
  screening: '#f59e0b',
  interview: '#06b6d4',
  offer: '#10b981',
  accepted: '#22c55e',
  rejected: '#ef4444',
};

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  const monday = new Date(now.getFullYear(), now.getMonth(), diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function computeStats(jobs: Job[]): DashboardStats {
  const total = jobs.length;
  const counts: Record<string, number> = {};
  for (const s of Object.keys(STATUS_LABELS)) {
    counts[s] = jobs.filter((j) => j.status === s).length;
  }

  // 回复率：有 timeline 事件（非 applied 类型）的岗位
  const replied = jobs.filter(
    (j) => j.timeline.length > 0 && j.timeline.some((t) => t.type !== 'applied')
  ).length;
  const replyRate = total > 0 ? Math.round((replied / total) * 100) : 0;

  // 面试转化率：进入 interview+offer+accepted / 总投递
  const intoInterview = counts['interview'] + counts['offer'] + counts['accepted'];
  const interviewRate = total > 0 ? Math.round((intoInterview / total) * 100) : 0;

  // Offer 率
  const offerCount = counts['offer'] + counts['accepted'];
  const offerRate = total > 0 ? Math.round((offerCount / total) * 100) : 0;

  // 本周 / 本月
  const weekStart = getWeekStart();
  const monthStart = getMonthStart();
  const thisWeek = jobs.filter((j) => new Date(j.createdAt) >= weekStart).length;
  const thisMonth = jobs.filter((j) => new Date(j.createdAt) >= monthStart).length;

  // 状态分布（饼图/柱状图用）
  const statusDistribution = Object.entries(STATUS_LABELS).map(([key, label]) => ({
    name: label,
    value: counts[key] || 0,
    color: STATUS_COLORS[key] || '#6b7280',
  }));

  // 近30天投递趋势
  const dailyTrend: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    const count = jobs.filter((j) => {
      const created = new Date(j.createdAt);
      return (
        created.getFullYear() === d.getFullYear() &&
        created.getMonth() === d.getMonth() &&
        created.getDate() === d.getDate()
      );
    }).length;
    dailyTrend.push({ date: dateStr, count });
  }

  return {
    total,
    wishlist: counts['wishlist'] || 0,
    applied: counts['applied'] || 0,
    screening: counts['screening'] || 0,
    interview: counts['interview'] || 0,
    offer: counts['offer'] || 0,
    accepted: counts['accepted'] || 0,
    rejected: counts['rejected'] || 0,
    replyRate,
    interviewRate,
    offerRate,
    thisWeek,
    thisMonth,
    statusDistribution,
    dailyTrend,
  };
}
