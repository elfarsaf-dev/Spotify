export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send("URL is required");
    }

    const range = req.headers.range;

    const headers = {
      "User-Agent": "Mozilla/5.0",
    };

    if (range) {
      headers["Range"] = range;
    }

    const response = await fetch(url, {
      headers,
    });

    // Ambil info dari server asal
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const contentLength = response.headers.get("content-length");
    const acceptRanges = response.headers.get("accept-ranges");

    // Set header ke client
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Disposition", "inline");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    if (response.status === 206) {
      res.status(206);
      const contentRange = response.headers.get("content-range");
      if (contentRange) {
        res.setHeader("Content-Range", contentRange);
      }
    } else {
      res.status(200);
    }

    // Stream data
    response.body.pipe(res);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
