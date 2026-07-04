import type { Tag, Template } from '../types';

export const DEFAULT_TAGS: Tag[] = [
  // 行业
  { id: 'tag-1', name: '互联网/IT', color: '#3b82f6', group: '行业' },
  { id: 'tag-2', name: '金融', color: '#f59e0b', group: '行业' },
  { id: 'tag-3', name: '教育', color: '#10b981', group: '行业' },
  { id: 'tag-4', name: '医疗', color: '#ef4444', group: '行业' },
  { id: 'tag-5', name: '制造业', color: '#8b5cf6', group: '行业' },
  { id: 'tag-6', name: '电商', color: '#ec4899', group: '行业' },

  // 薪资档位
  { id: 'tag-7', name: '10K以下', color: '#94a3b8', group: '薪资' },
  { id: 'tag-8', name: '10K-20K', color: '#64748b', group: '薪资' },
  { id: 'tag-9', name: '20K-35K', color: '#475569', group: '薪资' },
  { id: 'tag-10', name: '35K以上', color: '#1e293b', group: '薪资' },

  // 城市
  { id: 'tag-11', name: '北京', color: '#f43f5e', group: '城市' },
  { id: 'tag-12', name: '上海', color: '#f43f5e', group: '城市' },
  { id: 'tag-13', name: '广州', color: '#f43f5e', group: '城市' },
  { id: 'tag-14', name: '深圳', color: '#f43f5e', group: '城市' },
  { id: 'tag-15', name: '杭州', color: '#f43f5e', group: '城市' },
  { id: 'tag-16', name: '远程', color: '#22c55e', group: '城市' },

  // 公司规模
  { id: 'tag-17', name: '大厂', color: '#f97316', group: '公司类型' },
  { id: 'tag-18', name: '中型公司', color: '#f97316', group: '公司类型' },
  { id: 'tag-19', name: '创业公司', color: '#f97316', group: '公司类型' },
  { id: 'tag-20', name: '外企', color: '#f97316', group: '公司类型' },
];

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    title: 'Boss直聘-通用打招呼',
    scenario: 'Boss直聘',
    content: '您好，我对贵司的{岗位名称}岗位很感兴趣。我有相关工作经验，熟练掌握相关技能，希望能有机会进一步沟通。期待您的回复！',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl-2',
    title: 'Boss直聘-技术岗',
    scenario: 'Boss直聘',
    content: '您好，看到贵司在招{岗位名称}。我有X年后端开发经验，熟悉Java/Python/Go，参与过多个高并发项目。我的简历已上传附件，方便的话可以进一步交流。谢谢！',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl-3',
    title: '猎聘-简短版',
    scenario: '猎聘',
    content: '您好，看到贵司的{岗位名称}岗位和我的背景比较匹配。我在相关领域有X年经验，期待有机会详聊。简历已更新在平台上，谢谢查阅！',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl-4',
    title: '拉勾-技术岗',
    scenario: '拉勾',
    content: '你好，我对{公司名称}的{岗位名称}很感兴趣。我有扎实的技术基础和良好的团队协作能力，希望能加入贵司一起成长。这是我的在线简历，期待你的回复！',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl-5',
    title: '官网/内推-正式版',
    scenario: '官网/内推',
    content: '尊敬的HR您好，\n\n我是XXX，有X年{行业}行业经验。看到贵司{岗位名称}的招聘信息，非常感兴趣。\n\n我的核心优势：\n1. 精通XXX技术栈\n2. 主导过XXX项目，取得XXX成果\n3. 良好的沟通协作能力\n\n简历已投递至贵司系统，期待有机会面试交流。祝工作愉快！',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
