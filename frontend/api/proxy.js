export default async function handler(req, res) {
    const { path } = req.query;
  
    const backendBaseUrl = "https://t36pd2.onrender.com/api";
    const targetUrl = `${backendBaseUrl}/${path.join("/")}`;
  
    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
      });
  
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ message: "Proxy error", error: error.message });
    }
  }
  