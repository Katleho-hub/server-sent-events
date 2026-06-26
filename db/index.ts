import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://pgqqihxvfsgendocqmeo.supabase.co";
const supabaseKey = "sb_publishable_sIpLMiVXv3qj3nYNChcW4w_EdXk4hc1"; // process.env.SUPABASE_KEY

const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

export default supabaseClient;

// 0.e890be83-575f-4d53-9506-b3040086db6c.6yEHCaMhMDKsUI1v9c6S488mPt12Ab:LNnO0FVl5UAaMPDWXm3Q+Q==
