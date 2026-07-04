import { useState } from 'react';
import { useApp } from '../store/AppContext';
import TagBadge from '../components/TagBadge';
import { Plus, Pencil, Trash2, X, FolderOpen } from 'lucide-react';

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#64748b',
];

const PRESET_GROUPS = ['行业', '薪资', '城市', '公司类型', '技能', '其他'];

export default function Tags() {
  const { state, addTag, updateTag, deleteTag } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [formGroup, setFormGroup] = useState('其他');

  const groups = Array.from(new Set(state.tags.map((t) => t.group)));

  const openNew = (group?: string) => {
    setEditingId(null);
    setFormName('');
    setFormColor(PRESET_COLORS[0]);
    setFormGroup(group || '其他');
    setShowForm(true);
  };

  const openEdit = (tag: typeof state.tags[0]) => {
    setEditingId(tag.id);
    setFormName(tag.name);
    setFormColor(tag.color);
    setFormGroup(tag.group);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingId) {
      updateTag(editingId, {
        name: formName.trim(),
        color: formColor,
        group: formGroup,
      });
    } else {
      addTag({
        name: formName.trim(),
        color: formColor,
        group: formGroup,
      });
    }
    setShowForm(false);
  };

  // 统计每个标签关联的岗位数
  const tagJobCount = (tagId: string) =>
    state.jobs.filter((j) => j.tagIds.includes(tagId)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          分类标签
          <span className="text-base font-normal text-gray-400 ml-2">({state.tags.length})</span>
        </h2>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          新增标签
        </button>
      </div>

      {state.tags.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <FolderOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-3">还没有标签，快速创建第一批标签吧</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {PRESET_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => openNew(g)}
                className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                + {g}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const groupTags = state.tags.filter((t) => t.group === group);
            return (
              <div key={group}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {group}
                  </h3>
                  <button
                    onClick={() => openNew(group)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + 添加
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {groupTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2.5 hover:border-gray-300 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{tag.name}</span>
                        <span className="text-xs text-gray-400">
                          {tagJobCount(tag.id)}个岗位
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(tag)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`确定删除标签「${tag.name}」吗？关联的岗位会自动移除该标签。`)) {
                              deleteTag(tag.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 新增/编辑弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? '编辑标签' : '新增标签'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">标签名称</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="如：互联网/IT"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formColor === c ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c, '--tw-ring-color': c } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分组</label>
                <div className="flex gap-1.5 flex-wrap">
                  {PRESET_GROUPS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormGroup(g)}
                      className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                        formGroup === g
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value)}
                  placeholder="自定义分组名..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>

              {/* 预览 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">预览</label>
                <div className="bg-gray-50 rounded-lg p-3 flex gap-2">
                  <TagBadge name={formName || '标签预览'} color={formColor} />
                </div>
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
                {editingId ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
