import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_TAGS, DEFAULT_TEMPLATES } from '../data/defaults';
import type { AppState, Job, Template, Tag, TimelineEvent } from '../types';

// ===== Context =====
interface AppContextValue {
  state: AppState;

  // Jobs
  addJob: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => Job;
  updateJob: (id: string, data: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addTimelineEvent: (jobId: string, event: Omit<TimelineEvent, 'id'>) => void;

  // Templates
  addTemplate: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => Template;
  updateTemplate: (id: string, data: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;

  // Tags
  addTag: (data: Omit<Tag, 'id'>) => Tag;
  updateTag: (id: string, data: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ===== Provider =====
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useLocalStorage<AppState>('job-tracker-data', {
    jobs: [],
    templates: DEFAULT_TEMPLATES,
    tags: DEFAULT_TAGS,
  });

  // ---- Jobs ----
  const addJob = useCallback(
    (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
      const now = new Date().toISOString();
      const job: Job = {
        ...data,
        id: uuid(),
        timeline: [],
        createdAt: now,
        updatedAt: now,
      };
      setState((prev) => ({ ...prev, jobs: [job, ...prev.jobs] }));
      return job;
    },
    [setState]
  );

  const updateJob = useCallback(
    (id: string, data: Partial<Job>) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === id ? { ...j, ...data, updatedAt: new Date().toISOString() } : j
        ),
      }));
    },
    [setState]
  );

  const deleteJob = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.filter((j) => j.id !== id),
      }));
    },
    [setState]
  );

  const addTimelineEvent = useCallback(
    (jobId: string, event: Omit<TimelineEvent, 'id'>) => {
      const newEvent: TimelineEvent = { ...event, id: uuid() };
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === jobId
            ? { ...j, timeline: [...j.timeline, newEvent], updatedAt: new Date().toISOString() }
            : j
        ),
      }));
    },
    [setState]
  );

  // ---- Templates ----
  const addTemplate = useCallback(
    (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const template: Template = { ...data, id: uuid(), createdAt: now, updatedAt: now };
      setState((prev) => ({ ...prev, templates: [template, ...prev.templates] }));
      return template;
    },
    [setState]
  );

  const updateTemplate = useCallback(
    (id: string, data: Partial<Template>) => {
      setState((prev) => ({
        ...prev,
        templates: prev.templates.map((t) =>
          t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
        ),
      }));
    },
    [setState]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        templates: prev.templates.filter((t) => t.id !== id),
        // 清除关联此模板的岗位引用
        jobs: prev.jobs.map((j) =>
          j.templateId === id ? { ...j, templateId: null } : j
        ),
      }));
    },
    [setState]
  );

  // ---- Tags ----
  const addTag = useCallback(
    (data: Omit<Tag, 'id'>) => {
      const tag: Tag = { ...data, id: uuid() };
      setState((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      return tag;
    },
    [setState]
  );

  const updateTag = useCallback(
    (id: string, data: Partial<Tag>) => {
      setState((prev) => ({
        ...prev,
        tags: prev.tags.map((t) => (t.id === id ? { ...t, ...data } : t)),
      }));
    },
    [setState]
  );

  const deleteTag = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t.id !== id),
        // 清除关联此标签的岗位引用
        jobs: prev.jobs.map((j) => ({
          ...j,
          tagIds: j.tagIds.filter((tid) => tid !== id),
        })),
      }));
    },
    [setState]
  );

  const value = useMemo(
    () => ({
      state,
      addJob, updateJob, deleteJob, addTimelineEvent,
      addTemplate, updateTemplate, deleteTemplate,
      addTag, updateTag, deleteTag,
    }),
    [state, addJob, updateJob, deleteJob, addTimelineEvent,
     addTemplate, updateTemplate, deleteTemplate,
     addTag, updateTag, deleteTag]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ===== Hook =====
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
