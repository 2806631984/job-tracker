import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import StatusBadge from '../components/StatusBadge';
import TagBadge from '../components/TagBadge';
import type { JobStatus } from '../types';
import { STATUS_CONFIG, STATUS_ORDER } from '../types';
import {
  Search, Filter, MapPin, Building2, Calendar, ChevronRight,
  Briefcase, Plus,
} from 'lucide-react';

export default function JobList() {
  const { state, updateJob } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = state.jobs;

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.company.toLowerCase().includes(s) ||
          j.position.toLowerCase().includes(s) ||
          j.location.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((j) => j.status === statusFilter);
    }

    if (selectedTagIds.length > 0) {
      list = list.filter((j) => selectedTagIds.some((tid) => j.tagIds.includes(tid)));
    }

    // 按更新时间倒序
    list = [...list].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return list;
  }, [state.jobs, search, statusFilter, selectedTagIds]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
    updateJob(jobId, { status: newStatus });
  };

  // 所有可用的标签（用于筛选栏）
  const allTags = state.tags;

  return (
    <div>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          岗位列表
          <span className="text-base font-normal text-gray-400 ml-2">({filtered.length})</span>
        </h2>
        <button
          onClick={() => navigate('/jobs/new')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          新增岗位
        </button>
      </div>

      {/* 搜索 + 筛选栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
        {/* 搜索框 */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索公司、岗位、地点..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 状态筛选 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          <button
            onClick={() => setStatusFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {STATUS_ORDER.map((s) => {
            const config = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  statusFilter === s
                    ? `${config.bg} ${config.color} ring-1 ring-current`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-xs text-gray-400 mt-1 shrink-0">标签:</span>
            <div className="flex gap-1.5 flex-wrap">
              {allTags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                  selected={selectedTagIds.includes(tag.id)}
                  onClick={() => toggleTag(tag.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 岗位列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-3">
            {state.jobs.length === 0 ? '还没有投递记录，快去新增吧' : '没有匹配的岗位'}
          </p>
          {state.jobs.length === 0 && (
            <button
              onClick={() => navigate('/jobs/new')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + 新增第一条投递记录
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => {
            const template = job.templateId
              ? state.templates.find((t) => t.id === job.templateId)
              : null;
            const tags = state.tags.filter((t) => job.tagIds.includes(t.id));

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {job.position}
                      </h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-2 flex-wrap">
                      <Building2 size={13} />
                      {job.company}
                      {job.location && (
                        <>
                          <span className="text-gray-300">|</span>
                          <MapPin size={13} />
                          {job.location}
                        </>
                      )}
                      {job.salary && (
                        <>
                          <span className="text-gray-300">|</span>
                          {job.salary}
                        </>
                      )}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      {tags.map((tag) => (
                        <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 sm:self-start">
                    {/* 快速状态切换 */}
                    <select
                      value={job.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(job.id, e.target.value as JobStatus);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center text-xs text-gray-400 gap-1">
                      <Calendar size={12} />
                      {new Date(job.applyDate).toLocaleDateString('zh-CN')}
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>

                {/* 关联模板提示 */}
                {template && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                    📝 打招呼模板：{template.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
