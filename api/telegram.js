import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const STREET_RE =
  /\b((?:вул\.?|вулиця|просп\.?|пр-т|проспект|пров\.?|провулок|бульв\.?|бульвар|пл\.?|площа|шосе|узвіз|набережна)\s+[^,.;\n]+?)(?=\s+(?:буд\.?|д\.?|кв\.?|під'?їзд|поверх)\b|[,.;\n]|$)/iu;
const HOUSE_RE = /\b(?:буд\.?|д\.?)\s*([0-9]+[0-9А-ЯA-Zа-яa-z/-]*)\b/iu;

function parseStreet(text) {
  const normalized = text.trim().replace(/\s+/g, " ");
  const streetMatch = normalized.match(STREET_RE);

  if (!streetMatch) return normalized;

  const street = streetMatch[1].trim();
  const tail = normalized.slice(streetMatch.index + streetMatch[0].length);
  const houseMatch = tail.match(HOUSE_RE);

  return houseMatch ? `${street}, ${houseMatch[1]}` : street;
}

async function geocode(text) {
  // поки заглушка
  return {
    lat: 50.4501 + Math.random() * 0.01,
    lng: 30.5234 + Math.random() * 0.01,
  };
}

export default async function handler(req, res) {
  try {
    console.log("BODY:", req.body);
    const body = req.body;

    // Telegram webhook format
    const message = body?.message?.text || "";

    if (!message) {
      return res.status(200).json({ ok: true });
    }

    const street = parseStreet(message);

    const { lat, lng } = await geocode(street);

   const { data, error } = await supabase
  .from("heat_points")
  .insert([{ street: "test", lat: 50, lng: 30, weight: 1 }]);

    console.log("INSERT ERROR:", error);
    console.log("INSERT DATA:", data);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "fail" });
  }
}
