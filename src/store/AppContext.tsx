import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { DEFAULT_TAGS, DEFAULT_TEMPLATES } from '../data/defaults';
import type { Job, JobStatus, Template, Tag, TimelineEvent } from '../types';

interface AppContextValue {
  state: { jobs: Job[]; templates: Template[]; tags: Tag[] };
  addJob: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => Promise<Job | null>;
  updateJob: (id: string, data: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addTimelineEvent: (jobId: string, event: Omit<TimelineEvent, 'id'>) => Promise<void>;
  addTemplate: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Template | null>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  addTag: (data: Omit<Tag, 'id'>) => Promise<Tag | null>;
  updateTag: (id: string, data: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // 从 Supabase 加载数据
  useEffect(() => {
    if (!user) {
      setJobs([]);
      setTemplates([]);
      setTags([]);
      setLoading(false);
      return;
    }

    const uid = user.id;  // 已验证非 null，让 TS 类型收窄

    async function loadData() {
      setLoading(true);
      const [jobsRes, templatesRes, tagsRes] = await Promise.all([
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('templates').select('*').order('created_at', { ascending: false }),
        supabase.from('tags').select('*').order('created_at', { ascending: false }),
      ]);

      if (jobsRes.data) setJobs(mapJobs(jobsRes.data));
      else setJobs([]);

      if (templatesRes.data) {
        setTemplates(templatesRes.data.map(mapTemplate));
      } else {
        const defaults = DEFAULT_TEMPLATES.map((t) => ({
          ...t,
          user_id: uid,
          created_at: t.createdAt,
          updated_at: t.updatedAt,
        }));
        await supabase.from('templates').upsert(defaults);
        setTemplates(DEFAULT_TEMPLATES);
      }

      if (tagsRes.data) {
        setTags(tagsRes.data.map(mapTag));
      } else {
        const defaults = DEFAULT_TAGS.map((t) => ({
          ...t,
          user_id: uid,
        }));
        await supabase.from('tags').upsert(defaults);
        setTags(DEFAULT_TAGS);
      }

      setLoading(false);
    }

    loadData();
  }, [user]);

  // ---- Jobs ----
  const addJob = useCallback(async (input: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    if (!user) return null;
    const newJob = {
      user_id: user.id,
      company: input.company,
      position: input.position,
      status: input.status,
      salary: input.salary,
      location: input.location,
      platform: input.platform,
      apply_date: input.applyDate,
      job_url: input.jobUrl,
      note: input.note,
      contact_name: input.contactName,
      contact_info: input.contactInfo,
      template_id: input.templateId,
      tag_ids: input.tagIds,
      timeline: [],
    };
    const { data, error } = await supabase.from('jobs').insert(newJob).select().single();
    if (error) { console.error(error); return null; }
    const job = mapJob(data);
    setJobs((prev) => [job, ...prev]);
    return job;
  }, [user]);

  const updateJob = useCallback(async (id: string, data: Partial<Job>) => {
    if (!user) return;
    const update: Record<string, unknown> = {};
    if (data.company !== undefined) update.company = data.company;
    if (data.position !== undefined) update.position = data.position;
    if (data.status !== undefined) update.status = data.status;
    if (data.salary !== undefined) update.salary = data.salary;
    if (data.location !== undefined) update.location = data.location;
    if (data.platform !== undefined) update.platform = data.platform;
    if (data.applyDate !== undefined) update.apply_date = data.applyDate;
    if (data.jobUrl !== undefined) update.job_url = data.jobUrl;
    if (data.note !== undefined) update.note = data.note;
    if (data.contactName !== undefined) update.contact_name = data.contactName;
    if (data.contactInfo !== undefined) update.contact_info = data.contactInfo;
    if (data.templateId !== undefined) update.template_id = data.templateId;
    if (data.tagIds !== undefined) update.tag_ids = data.tagIds;
    if (data.timeline !== undefined) update.timeline = data.timeline;

    if (Object.keys(update).length === 0) return;
    await supabase.from('jobs').update(update).eq('id', id);

    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...data } : j))
    );
  }, [user]);

  const deleteJob = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('jobs').delete().eq('id', id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, [user]);

  const addTimelineEvent = useCallback(async (jobId: string, event: Omit<TimelineEvent, 'id'>) => {
    if (!user) return;
    const newEvent: TimelineEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    const updatedTimeline = [...job.timeline, newEvent];
    await supabase.from('jobs').update({ timeline: updatedTimeline }).eq('id', jobId);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, timeline: updatedTimeline } : j))
    );
  }, [user, jobs]);

  // ---- Templates ----
  const addTemplate = useCallback(async (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;
    const { data: inserted, error } = await supabase.from('templates').insert({
      user_id: user.id,
      title: data.title,
      scenario: data.scenario,
      content: data.content,
    }).select().single();
    if (error) { console.error(error); return null; }
    const tpl = mapTemplate(inserted);
    setTemplates((prev) => [tpl, ...prev]);
    return tpl;
  }, [user]);

  const updateTemplate = useCallback(async (id: string, data: Partial<Template>) => {
    if (!user) return;
    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.scenario !== undefined) update.scenario = data.scenario;
    if (data.content !== undefined) update.content = data.content;
    await supabase.from('templates').update(update).eq('id', id);
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, [user]);

  const deleteTemplate = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('templates').delete().eq('id', id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setJobs((prev) => prev.map((j) => j.templateId === id ? { ...j, templateId: null } : j));
  }, [user]);

  // ---- Tags ----
  const addTag = useCallback(async (data: Omit<Tag, 'id'>) => {
    if (!user) return null;
    const { data: inserted, error } = await supabase.from('tags').insert({
      user_id: user.id,
      name: data.name,
      color: data.color,
      group: data.group,
    }).select().single();
    if (error) { console.error(error); return null; }
    const tag = mapTag(inserted);
    setTags((prev) => [...prev, tag]);
    return tag;
  }, [user]);

  const updateTag = useCallback(async (id: string, data: Partial<Tag>) => {
    if (!user) return;
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.color !== undefined) update.color = data.color;
    if (data.group !== undefined) update.group = data.group;
    await supabase.from('tags').update(update).eq('id', id);
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, [user]);

  const deleteTag = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('tags').delete().eq('id', id);
    setTags((prev) => prev.filter((t) => t.id !== id));
    setJobs((prev) =>
      prev.map((j) => ({ ...j, tagIds: j.tagIds.filter((tid) => tid !== id) }))
    );
  }, [user]);

  return (
    <AppContext.Provider value={{
      state: { jobs, templates, tags },
      addJob, updateJob, deleteJob, addTimelineEvent,
      addTemplate, updateTemplate, deleteTemplate,
      addTag, updateTag, deleteTag,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// --- 映射函数：Supabase 字段名 → 前端字段名 ---
function mapJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    company: row.company as string,
    position: row.position as string,
    status: row.status as JobStatus,
    salary: (row.salary as string) || '',
    location: (row.location as string) || '',
    platform: (row.platform as string) || '',
    applyDate: row.apply_date as string,
    jobUrl: (row.job_url as string) || '',
    note: (row.note as string) || '',
    contactName: (row.contact_name as string) || '',
    contactInfo: (row.contact_info as string) || '',
    templateId: (row.template_id as string) || null,
    tagIds: (row.tag_ids as string[]) || [],
    timeline: (row.timeline as TimelineEvent[]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapJobs(rows: Record<string, unknown>[]): Job[] {
  return rows.map(mapJob);
}

function mapTemplate(row: Record<string, unknown>): Template {
  return {
    id: row.id as string,
    title: row.title as string,
    scenario: (row.scenario as string) || '',
    content: (row.content as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapTag(row: Record<string, unknown>): Tag {
  return {
    id: row.id as string,
    name: row.name as string,
    color: (row.color as string) || '#3b82f6',
    group: (row.group as string) || '其他',
  };
}
