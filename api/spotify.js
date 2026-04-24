export default async function handler(req, res) {
  const { q, link } = req.query;

  try {
    // ============================
    // SEARCH (NEXRAY)
    // ============================
    if (q) {
      const api =
        "https://api.nexray.web.id/search/spotify?q=" +
        encodeURIComponent(q);

      const response = await fetch(api);
      const data = await response.json();

      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json(data);
    }

    // ============================
    // DOWNLOAD (NEXRAY)
    // ============================
    if (link) {
      const api =
        "https://api.nexray.web.id/downloader/spotify?url=" +
        encodeURIComponent(link);

      const response = await fetch(api);
      const data = await response.json();

      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json(data);
    }

    // ============================
    // ERROR
    // ============================
    return res.status(400).json({
      error: "gunakan ?q= untuk search atau ?link= untuk download"
    });

  } catch (err) {
    return res.status(500).json({ error: "proxy error" });
  }
}
