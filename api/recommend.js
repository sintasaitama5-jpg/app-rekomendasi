module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, category } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const catLabel = {
    all: "Produktivitas, AI & Tech, dan Bisnis & Keuangan",
    Produktivitas: "Produktivitas",
    "AI & Tech": "AI dan Teknologi",
    "Bisnis & Keuangan": "Bisnis dan Keuangan",
  }[category] || "semua kategori";

  const systemPrompt = `Kamu adalah analis teknologi masa depan. Rekomendasikan 5 aplikasi yang akan relevan hingga 2035 untuk kategori: ${catLabel}.

Pertanyaan: ${prompt}

Balas HANYA dengan JSON array ini, tanpa teks lain:
[{"name":"Nama App","icon":"emoji","category":"Kategori","survivalScore":85,"description":"Deskripsi 2-3 kalimat.","tags":["tag1","tag2","tag3"],"trendReason":"Satu kalimat alasan tren."}]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Gemini API error");

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON
    const s = text.indexOf("["), e = text.lastIndexOf("]");
    if (s === -1 || e === -1) throw new Error("Format tidak valid");

    const parsed = JSON.parse(text.slice(s, e + 1));
    if (!Array.isArray(parsed)) throw new Error("Bukan array");

    return res.status(200).json({ apps: parsed });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
