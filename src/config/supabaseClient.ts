import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ysmgdfkjyyjgldpqhnph.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzbWdkZmtqeXlqZ2xkcHFobnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NDkzMjIsImV4cCI6MjAxNjIyNTMyMn0.Kf_R_24HWeKgVv8bw_Xrc2KgVm4zd2IMzgv6bJZXHng',
);

export default supabase;
