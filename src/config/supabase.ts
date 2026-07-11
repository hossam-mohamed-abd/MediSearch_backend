import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing.");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is missing.");
}

export const STORAGE_BUCKET =
  process.env.SUPABASE_BUCKET || "medisearch-data-lake";

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);

export default supabase;