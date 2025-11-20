import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bafgjgwsfogssucxpllo.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZmdqZ3dzZm9nc3N1Y3hwbGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTg1NTUsImV4cCI6MjA3OTEzNDU1NX0.OwQa1nm-sNfXPufbypvPYIy_TXNkQFd3y1t68pASCAg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
