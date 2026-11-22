import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.co';
const supabaseAnonKey = 'sb_publishable_SC9FLJ1wPu-KaYfjT6dKgA_vHbDloJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
