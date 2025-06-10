const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/certificate", async (req, res) => {
  const name = decodeURIComponent(req.query.name || "受講者");

  // HTMLテンプレート読み込み & 変数差し替え
  const htmlPath = path.join(__dirname, "templates", "certificate.html");
  const template = fs.readFileSync(htmlPath, "utf8").replace("{{name}}", name);

  const browser = await puppeteer.launch({
    headless: "new", // puppeteer@20以降で推奨
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(template, { waitUntil: "networkidle0" });

  const imageBuffer = await page.screenshot({ type: "png" });
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.send(imageBuffer);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
