const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const app = express();

app.get("/certificate", async (req, res) => {
  const name = req.query.name || "受講者";

  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage(__dirname + "/assets/certificate-template.png");
  ctx.drawImage(bg, 0, 0, 1200, 800);

  ctx.font = "bold 48px sans-serif";
  ctx.fillStyle = "#333";
  ctx.fillText(decodeURIComponent(name), 500, 400);

  res.setHeader("Content-Type", "image/png");
  canvas.pngStream().pipe(res);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
