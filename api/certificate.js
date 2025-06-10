const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

module.exports = async (req, res) => {
  const { name = "受講者" } = req.query;

  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            width: 1200px;
            height: 800px;
            margin: 0;
            font-family: 'Noto Sans JP', sans-serif;
            background: url('https://${
              req.headers.host
            }/assets/certificate-template.png') no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .name {
            font-size: 48px;
            color: #333;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="name">${decodeURIComponent(name)}</div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(html, { waitUntil: "networkidle0" });

  const buffer = await page.screenshot({ type: "png" });
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
};
