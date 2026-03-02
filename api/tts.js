export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { text }, voice: { languageCode: "fr-FR", name: "fr-FR-Chirp3-HD-Charon" }, audioConfig: { audioEncoding: "MP3" } }) }
    );
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.status(200).json({ audioContent: data.audioContent });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
