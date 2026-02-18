export default async function handler(req, res) {

  const { link } = req.query;

  if (!link) {
    return res.status(400).json({ error: "missing link" });
  }

  try {

    const api =
      "https://api.ferdev.my.id/downloader/spotify?link="
      + encodeURIComponent(link)
      + "&apikey=key-elfs";

    const response = await fetch(api);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "proxy error" });
  }
}
