import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tsijfzvrxznvzowvglqb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaWpmenZyeHpudnpvd3ZnbHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM5NzE4MzcsImV4cCI6MjAyOTU0NzgzN30.KCbDeKWXTc1mpCTaqunj8MiMGCI8S4zr3SklCp9RJgw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
