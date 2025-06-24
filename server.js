const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/certificate', async (req, res) => {
  const name = req.query.name || "受講者";

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
            background: #f2f2f2;
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
        <div class="name">${name}</div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(html, { waitUntil: "networkidle0" });

  const buffer = await page.screenshot({ type: 'png' });
  await browser.close();

  res.setHeader('Content-Disposition', 'attachment; filename=certificate.png');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
