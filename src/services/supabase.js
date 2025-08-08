import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://saahcsjsoplbwvfsfkoj.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseURL, supabaseKey);