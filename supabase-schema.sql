-- 岗位表
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'wishlist',
  salary TEXT DEFAULT '',
  location TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  apply_date DATE DEFAULT CURRENT_DATE,
  job_url TEXT DEFAULT '',
  note TEXT DEFAULT '',
  contact_name TEXT DEFAULT '',
  contact_info TEXT DEFAULT '',
  template_id UUID,
  tag_ids UUID[] DEFAULT '{}',
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 模板表
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scenario TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 标签表
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  "group" TEXT DEFAULT '其他',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 行级安全：用户只能看自己的数据
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own jobs" ON jobs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own templates" ON templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
