import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rrbjnvtktckumycdshfb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYmpudnRrdGNrdW15Y2RzaGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTM0MjksImV4cCI6MjA1NTAyOTQyOX0.Ttpp4Arn2jpk8HKdvIZNVu-RZd_rEfff2cVgTPEJBHA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
