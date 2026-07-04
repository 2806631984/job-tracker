import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Copy, Plus, Pencil, Trash2, Search, X, Check } from 'lucide-react';

export default function Templates() {
  const { state, addTemplate, updateTemplate, deleteTemplate } = useApp();
  const [search, setSearch] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState('');

  // 新增/编辑表单
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formScenario, setFormScenario] = useState('');
  const [formContent, setFormContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scenarios = Array.from(new Set(state.templates.map((t) => t.scenario)));

  const filtered = state.templates.filter((t) => {
    if (search) {
      const s = search.toLowerCase();
      if (!t.title.toLowerCase().includes(s) && !t.content.toLowerCase().includes(s)) return false;
    }
    if (scenarioFilter && t.scenario !== scenarioFilter) return false;
    return true;
  });

  const openNew = () => {
    setEditingId(null);
    setFormTitle('');
    setFormScenario('');
    setFormContent('');
    setShowForm(true);
  };

  const openEdit = (tpl: typeof state.templates[0]) => {
    setEditingId(tpl.id);
    setFormTitle(tpl.title);
    setFormScenario(tpl.scenario);
    setFormContent(tpl.content);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim() || !formScenario.trim()) return;
    if (editingId) {
      updateTemplate(editingId, {
        title: formTitle.trim(),
        scenario: formScenario.trim(),
        content: formContent.trim(),
      });
    } else {
      addTemplate({
        title: formTitle.trim(),
        scenario: formScenario.trim(),
        content: formContent.trim(),
      });
    }
    setShowForm(false);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          打招呼模板
          <span className="text-base font-normal text-gray-400 ml-2">({filtered.length})</span>
        </h2>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          新增模板
        </button>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索模板..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={scenarioFilter}
          onChange={(e) => setScenarioFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">全部场景</option>
          {scenarios.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 模板列表 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-3">
            {state.templates.length === 0 ? '还没有模板，快去创建吧' : '没有匹配的模板'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{tpl.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                    {tpl.scenario}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(tpl.content, tpl.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={copiedId === tpl.id ? '已复制' : '复制'}
                  >
                    {copiedId === tpl.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(tpl)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('确定删除这个模板吗？')) deleteTemplate(tpl.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">
                {tpl.content}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                {`{岗位名称}`} {`{公司名称}`} 等占位符会在使用时自动替换
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新增/编辑弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? '编辑模板' : '新增模板'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模板名称</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="如：Boss直聘-技术岗"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">场景分类</label>
                <input
                  type="text"
                  value={formScenario}
                  onChange={(e) => setFormScenario(e.target.value)}
                  placeholder="如：Boss直聘、猎聘、官网/内推"
                  list="scenarios-list"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="scenarios-list">
                  {scenarios.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  话术内容
                  <span className="text-gray-400 font-normal ml-2">
                    （可用 {'{岗位名称}'} {'{公司名称}'} 作为占位符）
                  </span>
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="您好，我对贵司的{岗位名称}岗位很感兴趣..."
                  rows={5}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 text-sm text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                {editingId ? '保存修改' : '创建模板'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
