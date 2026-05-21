import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// дуже простий fake geocoder (пізніше заміниш)
async function geocode(text) {
  // тут можна підключити Google / Nominatim
  // поки заглушка
  return {
    lat: 50.4501 + Math.random() * 0.01,
    lng: 30.5234 + Math.random() * 0.01,
  };
}

export default async function handler(req, res) {
  try {
    const body = req.body;

    // Telegram webhook format
    const message = body?.message?.text || "";

    if (!message) {
      return res.status(200).json({ ok: true });
    }

    // TODO: тут можна парсити вулиці
    const street = message;

    const { lat, lng } = await geocode(street);

    const { error } = await supabase.from("heat_points").insert([
      {
        street,
        lat,
        lng,
        weight: 1,
      },
    ]);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "fail" });
  }
}