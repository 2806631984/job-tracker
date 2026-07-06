import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import TagBadge from '../components/TagBadge';
import type { JobStatus } from '../types';
import { STATUS_CONFIG, STATUS_ORDER } from '../types';
import { ArrowLeft, Save, Copy } from 'lucide-react';

export default function JobForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { state, addJob, updateJob } = useApp();

  const existingJob = id ? state.jobs.find((j) => j.id === id) : undefined;
  const isEdit = !!existingJob;

  // 表单状态
  const [company, setCompany] = useState(existingJob?.company || '');
  const [position, setPosition] = useState(existingJob?.position || '');
  const [status, setStatus] = useState<JobStatus>(existingJob?.status || 'wishlist');
  const [salary, setSalary] = useState(existingJob?.salary || '');
  const [location, setLocation] = useState(existingJob?.location || '');
  const [platform, setPlatform] = useState(existingJob?.platform || '');
  const [applyDate, setApplyDate] = useState(
    existingJob?.applyDate || new Date().toISOString().split('T')[0]
  );
  const [jobUrl, setJobUrl] = useState(existingJob?.jobUrl || '');
  const [note, setNote] = useState(existingJob?.note || '');
  const [contactName, setContactName] = useState(existingJob?.contactName || '');
  const [contactInfo, setContactInfo] = useState(existingJob?.contactInfo || '');
  const [templateId, setTemplateId] = useState(existingJob?.templateId || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(existingJob?.tagIds || []);

  // 模板预览
  const selectedTemplate = state.templates.find((t) => t.id === templateId);
  const [templatePreview, setTemplatePreview] = useState('');
  useEffect(() => {
    if (selectedTemplate) {
      setTemplatePreview(
        selectedTemplate.content
          .replace(/\{岗位名称\}/g, position || '___')
          .replace(/\{公司名称\}/g, company || '___')
      );
    } else {
      setTemplatePreview('');
    }
  }, [selectedTemplate, position, company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    const jobData = {
      company: company.trim(),
      position: position.trim(),
      status,
      salary: salary.trim(),
      location: location.trim(),
      platform: platform.trim(),
      applyDate,
      jobUrl: jobUrl.trim(),
      note: note.trim(),
      contactName: contactName.trim(),
      contactInfo: contactInfo.trim(),
      templateId: templateId || null,
      tagIds: selectedTagIds,
    };

    if (isEdit && id) {
      updateJob(id, jobData);
    } else {
      addJob(jobData);
    }
    navigate('/jobs');
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const copyTemplate = () => {
    if (templatePreview) {
      navigator.clipboard.writeText(templatePreview).then(() => {
        alert('✅ 模板已复制到剪贴板！');
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 顶部栏 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? '编辑岗位' : '新增岗位'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 基本信息 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide">基本信息</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                公司名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="如：字节跳动"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                岗位名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="如：前端开发工程师"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">当前状态</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">薪资范围</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="如：20K-30K"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">工作地点</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="如：北京·朝阳区"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">投递平台</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择</option>
                <option value="Boss直聘">Boss直聘</option>
                <option value="拉勾">拉勾</option>
                <option value="猎聘">猎聘</option>
                <option value="智联招聘">智联招聘</option>
                <option value="前程无忧">前程无忧</option>
                <option value="脉脉">脉脉</option>
                <option value="官网">官网</option>
                <option value="内推">内推</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">投递日期</label>
              <input
                type="date"
                value={applyDate}
                onChange={(e) => setApplyDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">岗位链接</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 联系人 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide">联系人</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">HR/联系人</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="姓名或昵称"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">联系方式</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="微信/手机号"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 打招呼模板 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide">打招呼模板</h3>
          <div>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">不使用模板</option>
              {state.templates.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.scenario}] {t.title}
                </option>
              ))}
            </select>
          </div>
          {templatePreview && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 relative">
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap pr-12">{templatePreview}</p>
              <button
                type="button"
                onClick={copyTemplate}
                className="absolute top-3 right-3 p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors"
                title="复制模板"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* 分类标签 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide">分类标签</h3>
          {state.tags.length === 0 ? (
            <p className="text-sm text-gray-400">暂无标签，请先在"分类标签"页面添加</p>
          ) : (
            <div className="space-y-3">
              {Array.from(new Set(state.tags.map((t) => t.group))).map((group) => (
                <div key={group}>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 block">{group}</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {state.tags
                      .filter((t) => t.group === group)
                      .map((tag) => (
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
              ))}
            </div>
          )}
        </div>

        {/* 备注 */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wide">备注</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="JD要点、公司印象、注意事项..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 提交 */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Save size={18} />
          {isEdit ? '保存修改' : '添加投递记录'}
        </button>
      </form>
    </div>
  );
}
