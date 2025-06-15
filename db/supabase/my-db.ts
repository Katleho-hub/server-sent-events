import { QueryData, SupabaseClient, createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";

// Create a single supabase client for interacting with your database
const supabaseUrl = "https://lhegewixvhmxeuicbfah.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZWdld2l4dmhteGV1aWNiZmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTE5NTcsImV4cCI6MjA2MTY2Nzk1N30.0DnYaoyuraVLcvbUdWS_TPpgMXbOHF4C1kXwi5wdaEQ"; // process.env.SUPABASE_KEY

const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

export default supabaseClient;
