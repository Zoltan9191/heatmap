import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from("heat_points")
      .select("*");

    if (error) throw error;

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}