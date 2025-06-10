const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  try {
    const { name = "受講者" } = req.query;

    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath:
        (await chrome.executablePath) || "/usr/bin/chromium-browser",
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    await page.setContent(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;font-size:48px;font-family:sans-serif;">
          ${decodeURIComponent(name)}
        </body>
      </html>
    `);

    const buffer = await page.screenshot({ type: "png" });
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("Function error:", err);
    res.status(500).send("Internal Server Error");
  }
};
