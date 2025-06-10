// api/certificate.js
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

// 日本語フォントを使いたい場合は登録（Vercelにフォントファイルもアップロードする必要あり）
// registerFont(path.join(__dirname, '../assets/NotoSansJP-Regular.otf'), { family: 'Noto Sans JP' });

module.exports = async (req, res) => {
  const { name = "受講者" } = req.query;

  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const templatePath = path.join(
    __dirname,
    "../assets/certificate-template.png"
  );
  const background = await loadImage(templatePath);
  ctx.drawImage(background, 0, 0, width, height);

  ctx.font = "bold 48px sans-serif";
  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  ctx.fillText(decodeURIComponent(name), width / 2, height / 2 + 50);

  res.setHeader("Content-Type", "image/png");
  canvas.pngStream().pipe(res);
};
