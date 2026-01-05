export default async function handler(req, res) {
  try {
    const name = (req.query.name || req.body?.name || "").toString();
    const server = (req.query.server || req.body?.server || "adven").toString();

    if (!name) {
      return res.status(400).json({ ok: false, error: "missing name" });
    }

    const target = "https://dundam.xyz/dat/searchData.jsp";

    const body = new URLSearchParams();
    body.set("name", name);
    body.set("server", server);

    const r = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "accept": "application/json, text/plain, */*",
        "referer": "https://dundam.xyz/",
        "origin": "https://dundam.xyz",
      },
      body,
    });

    const text = await r.text();
    const trimmed = (text || "").trim();

    if (!trimmed) {
      return res.status(502).json({ ok: false, error: "empty body from dundam", status: r.status });
    }
    if (trimmed.startsWith("<")) {
      return res.status(502).json({ ok: false, error: "html body from dundam", status: r.status });
    }

    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    return res.status(200).send(text);
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) });
  }
}
