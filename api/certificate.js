const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const { name = "受講者" } = req.query;

  const templatePath = path.join(__dirname, "../templates/certificate.html");
  const html = fs.readFileSync(templatePath, "utf8").replace("{{name}}", name);

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const buffer = await page.screenshot({ type: "png", fullPage: true });

  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
};
