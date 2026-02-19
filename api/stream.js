export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return new Response("URL is required", { status: 400 });
    }

    const range = req.headers.get("range");

    const headers = {
      "User-Agent": "Mozilla/5.0",
    };

    if (range) {
      headers["Range"] = range;
    }

    const response = await fetch(url, { headers });

    // Ambil header penting
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");

    const newHeaders = new Headers();
    newHeaders.set("Content-Type", contentType);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Accept-Ranges", "bytes");
    newHeaders.set("Content-Disposition", "inline");

    if (contentLength) {
      newHeaders.set("Content-Length", contentLength);
    }

    if (contentRange) {
      newHeaders.set("Content-Range", contentRange);
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });

  } catch (err) {
    return new Response("Proxy error: " + err.message, { status: 500 });
  }
}
