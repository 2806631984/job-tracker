import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxktdmhgctnjipqymgnq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4a3RkbWhnY3RuamlwcXltZ25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzI1NDIsImV4cCI6MjA5ODc0ODU0Mn0.nVQmpQ2oHKThlW3-mJ0Gl85p3-4AgKma35WDesxvdnI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
