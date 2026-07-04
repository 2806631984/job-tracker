// ===== 岗位状态 =====
export type JobStatus =
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected';

// ===== 时间线事件 =====
export interface TimelineEvent {
  id: string;
  date: string;
  type: 'applied' | 'reply' | 'interview' | 'offer' | 'reject' | 'note';
  content: string;
}

// ===== 岗位记录 =====
export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  salary: string;
  location: string;
  platform: string;
  applyDate: string;
  jobUrl: string;
  note: string;
  contactName: string;
  contactInfo: string;
  templateId: string | null;
  tagIds: string[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

// ===== 打招呼模板 =====
export interface Template {
  id: string;
  title: string;
  scenario: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ===== 分类标签 =====
export interface Tag {
  id: string;
  name: string;
  color: string;
  group: string;
}

// ===== 全局状态 =====
export interface AppState {
  jobs: Job[];
  templates: Template[];
  tags: Tag[];
}

// ===== 状态显示配置 =====
export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string }> = {
  wishlist:  { label: '想投',   color: 'text-purple-700', bg: 'bg-purple-100' },
  applied:   { label: '已投递', color: 'text-blue-700',   bg: 'bg-blue-100' },
  screening: { label: '筛选中', color: 'text-amber-700',  bg: 'bg-amber-100' },
  interview: { label: '面试中', color: 'text-cyan-700',   bg: 'bg-cyan-100' },
  offer:     { label: '已Offer', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  accepted:  { label: '已入职', color: 'text-green-700',  bg: 'bg-green-100' },
  rejected:  { label: '已拒绝', color: 'text-red-700',    bg: 'bg-red-100' },
};

// ===== 状态流转顺序 =====
export const STATUS_ORDER: JobStatus[] = [
  'wishlist', 'applied', 'screening', 'interview', 'offer', 'accepted', 'rejected',
];
