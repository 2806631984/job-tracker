import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { computeStats } from '../utils/stats';
import StatCard from '../components/StatCard';
import {
  Briefcase, MessageSquare, TrendingUp, CheckCircle,
  Clock, Target, Send, XCircle,
  Download, Upload, AlertCircle,
  PlusCircle, Tags, FileText,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, addJob, addTemplate, addTag } = useApp();
  const stats = computeStats(state.jobs);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 导出
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      jobs: state.jobs,
      templates: state.templates,
      tags: state.tags,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.jobs || !data.templates || !data.tags) {
        setImportMsg({ type: 'error', text: '文件格式不正确，缺少 jobs/templates/tags 数据' });
        return;
      }

      let imported = 0;
      // 导入标签
      for (const tag of data.tags) {
        await addTag({ name: tag.name, color: tag.color, group: tag.group });
        imported++;
      }
      // 导入模板
      for (const tpl of data.templates) {
        await addTemplate({ title: tpl.title, scenario: tpl.scenario, content: tpl.content });
        imported++;
      }
      // 导入岗位
      for (const job of data.jobs) {
        await addJob({
          company: job.company,
          position: job.position,
          status: job.status,
          salary: job.salary || '',
          location: job.location || '',
          platform: job.platform || '',
          applyDate: job.applyDate || new Date().toISOString().split('T')[0],
          jobUrl: job.jobUrl || '',
          note: job.note || '',
          contactName: job.contactName || '',
          contactInfo: job.contactInfo || '',
          templateId: job.templateId || null,
          tagIds: job.tagIds || [],
        });
        imported++;
      }

      setImportMsg({ type: 'success', text: `导入成功！共恢复 ${imported} 条数据` });
    } catch {
      setImportMsg({ type: 'error', text: '文件解析失败，请确认是 JSON 格式的备份文件' });
    }

    // 清空 input 以便重复导入同一文件
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">数据看板</h2>

      {/* 空状态引导 */}
      {stats.total === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
            <Briefcase size={32} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">欢迎使用投简历助手！</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            你还没有任何投递记录，按下面三步开始你的求职之旅
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left max-w-2xl mx-auto">
            <div className="flex gap-3 p-4 bg-blue-50 rounded-xl">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">1</span>
              <div>
                <p className="text-sm font-medium text-gray-800">设置分类标签</p>
                <p className="text-xs text-gray-500 mt-0.5">创建行业、薪资、城市等标签，方便筛选</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-purple-50 rounded-xl">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold shrink-0">2</span>
              <div>
                <p className="text-sm font-medium text-gray-800">准备打招呼模板</p>
                <p className="text-xs text-gray-500 mt-0.5">编辑或新建联系 HR 的话术模板</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-green-50 rounded-xl">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold shrink-0">3</span>
              <div>
                <p className="text-sm font-medium text-gray-800">添加第一条投递</p>
                <p className="text-xs text-gray-500 mt-0.5">填写公司和岗位信息，开始追踪</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/tags')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-purple-700 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Tags size={16} />
              设置标签
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <FileText size={16} />
              编辑模板
            </button>
            <button
              onClick={() => navigate('/jobs/new')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={16} />
              新增岗位
            </button>
          </div>
        </div>
      )}

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

      {/* 数据导出/导入 */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          数据备份
        </h3>

        {importMsg && (
          <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg mb-4 ${
            importMsg.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle size={16} />
            {importMsg.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            导出备份（JSON）
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Upload size={16} />
            导入备份（JSON）
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          导出数据为 JSON 文件保存到本地。重装系统或换设备后，登录同一账号再导入即可恢复。
        </p>
      </div>
    </div>
  );
}
