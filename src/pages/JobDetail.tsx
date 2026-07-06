import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import StatusBadge from '../components/StatusBadge';
import TagBadge from '../components/TagBadge';
import type { JobStatus } from '../types';
import { STATUS_CONFIG, STATUS_ORDER } from '../types';
import {
  ArrowLeft, Pencil, Trash2, Building2, MapPin, Globe, Calendar, Link2,
  User, Phone, MessageSquare, StickyNote, Clock, Plus, Copy, ExternalLink,
  Check, X,
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateJob, deleteJob, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = useApp();
  const job = state.jobs.find((j) => j.id === id);

  const [timelineContent, setTimelineContent] = useState('');
  const [timelineType, setTimelineType] = useState<'reply' | 'interview' | 'offer' | 'reject' | 'note'>('note');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-3">岗位不存在或已被删除</p>
        <button
          onClick={() => navigate('/jobs')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← 返回岗位列表
        </button>
      </div>
    );
  }

  const tags = state.tags.filter((t) => job.tagIds.includes(t.id));
  const template = job.templateId ? state.templates.find((t) => t.id === job.templateId) : null;

  const handleStatusChange = (newStatus: JobStatus) => {
    updateJob(job.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (confirm(`确定删除「${job.company} - ${job.position}」这条记录吗？此操作不可撤销。`)) {
      deleteJob(job.id);
      navigate('/jobs');
    }
  };

  const handleAddTimeline = () => {
    if (!timelineContent.trim()) return;
    addTimelineEvent(job.id, {
      date: new Date().toISOString(),
      type: timelineType,
      content: timelineContent.trim(),
    });
    setTimelineContent('');
  };

  const timelineTypeLabels: Record<string, string> = {
    reply: '有回复',
    interview: '面试',
    offer: 'Offer',
    reject: '被拒',
    note: '笔记',
  };

  const copyTemplate = () => {
    if (template) {
      const text = template.content
        .replace(/\{岗位名称\}/g, job.position)
        .replace(/\{公司名称\}/g, job.company);
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ 模板已复制到剪贴板！');
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          返回列表
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/jobs/new`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} />
            编辑
          </button>

          {/* Actually editing uses JobForm with id param... let me fix - use a modal or redirect */}
          <button
            onClick={() => {
              // 跳转到 JobForm 编辑模式 — 简单起见，直接导航到编辑页，用 sessionStorage 传数据
              sessionStorage.setItem('edit-job', JSON.stringify(job));
              navigate('/jobs/new');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} />
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            删除
          </button>
        </div>
      </div>

      {/* 岗位信息卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{job.position}</h1>
            <p className="text-gray-600 flex items-center gap-1.5">
              <Building2 size={15} />
              {job.company}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={job.status} size="md" />
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 信息网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {job.location && (
            <InfoRow icon={<MapPin size={14} />} label="地点" value={job.location} />
          )}
          {job.salary && (
            <InfoRow icon={<MapPin size={14} />} label="薪资" value={job.salary} />
          )}
          {job.platform && (
            <InfoRow icon={<Globe size={14} />} label="平台" value={job.platform} />
          )}
          <InfoRow
            icon={<Calendar size={14} />}
            label="投递日期"
            value={new Date(job.applyDate).toLocaleDateString('zh-CN')}
          />
          {job.contactName && (
            <InfoRow icon={<User size={14} />} label="联系人" value={job.contactName} />
          )}
          {job.contactInfo && (
            <InfoRow icon={<Phone size={14} />} label="联系方式" value={job.contactInfo} />
          )}
          {job.jobUrl && (
            <div className="flex items-center gap-2 text-gray-500">
              <Link2 size={14} />
              <span className="text-gray-400 text-xs">链接</span>
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 truncate flex items-center gap-1"
              >
                {job.jobUrl.length > 40 ? job.jobUrl.slice(0, 40) + '...' : job.jobUrl}
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-4 pt-4 border-t border-gray-100">
            {tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} color={tag.color} />
            ))}
          </div>
        )}
      </div>

      {/* 打招呼模板 */}
      {template && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <MessageSquare size={16} />
              打招呼模板：{template.title}
            </h3>
            <button
              onClick={copyTemplate}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Copy size={12} />
              复制话术
            </button>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
            {template.content
              .replace(/\{岗位名称\}/g, job.position)
              .replace(/\{公司名称\}/g, job.company)}
          </p>
        </div>
      )}

      {/* 备注 */}
      {job.note && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
            <StickyNote size={16} />
            备注
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.note}</p>
        </div>
      )}

      {/* 时间线 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-4">
          <Clock size={16} />
          时间线
        </h3>

        {/* 添加事件 */}
        <div className="flex gap-2 mb-4">
          <select
            value={timelineType}
            onChange={(e) => setTimelineType(e.target.value as typeof timelineType)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-2 shrink-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Object.entries(timelineTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input
            type="text"
            value={timelineContent}
            onChange={(e) => setTimelineContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTimeline()}
            placeholder="添加事件..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTimeline}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={14} />
            添加
          </button>
        </div>

        {job.timeline.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">暂无事件，记录面试、回复等进展吧</p>
        ) : (
          <div className="space-y-0">
            {[...job.timeline]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((event, idx, arr) => (
                <div key={event.id} className="flex gap-3 group">
                  {/* 时间线竖线 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      event.type === 'offer' ? 'bg-emerald-500' :
                      event.type === 'reject' ? 'bg-red-500' :
                      event.type === 'interview' ? 'bg-cyan-500' :
                      event.type === 'reply' ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`} />
                    {idx < arr.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 min-h-[20px]" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleString('zh-CN')}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                        {timelineTypeLabels[event.type] || event.type}
                      </span>
                      {/* 编辑/删除按钮 */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-auto">
                        <button
                          onClick={() => {
                            setEditingEventId(event.id);
                            setEditContent(event.content);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="编辑"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('确定删除这条事件吗？')) {
                              deleteTimelineEvent(job.id, event.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="删除"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {editingEventId === event.id ? (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateTimelineEvent(job.id, event.id, { content: editContent });
                              setEditingEventId(null);
                            } else if (e.key === 'Escape') {
                              setEditingEventId(null);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            updateTimelineEvent(job.id, event.id, { content: editContent });
                            setEditingEventId(null);
                          }}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingEventId(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">{event.content}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 辅助组件
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
