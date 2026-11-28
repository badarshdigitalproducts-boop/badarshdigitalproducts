import fs from "fs";
import path from "path";
import zlib from "zlib";

const ROOT = process.cwd();
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const VIDEOS_DIR = path.join(ROOT, "public", "videos");
const PDF_DIR = path.join(ROOT, "public", "downloads", "pdfs");
const DL_DIR = path.join(ROOT, "public", "downloads");
const CATALOG_IMG_DIR = path.join(ROOT, "public", "images", "catalog");
const UPLOADS_DIR = path.join(ROOT, "public", "uploads");

for (const dir of [AUDIO_DIR, VIDEOS_DIR, PDF_DIR, DL_DIR, CATALOG_IMG_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

/* ============================================================
   1. COPY VERIFIED ORIGINAL UPLOADS TO TRACKED PUBLIC PATHS
   ============================================================ */
const showreelSrc = path.join(UPLOADS_DIR, "gemini_generated_video_66231c0a-1795181803817.mp4");
if (fs.existsSync(showreelSrc)) {
  fs.copyFileSync(showreelSrc, path.join(VIDEOS_DIR, "badarsh-showreel.mp4"));
}

const fitnessImgSrc = path.join(UPLOADS_DIR, "90-day-lean-bulk-fitness-plan-1795546263917.png");
if (fs.existsSync(fitnessImgSrc)) {
  fs.copyFileSync(fitnessImgSrc, path.join(CATALOG_IMG_DIR, "90-day-fitness.png"));
}

const marketingPdfSrc = path.join(UPLOADS_DIR, "3-month-humanized-digital-marketing-training-plan-1795546243980.pdf");
if (fs.existsSync(marketingPdfSrc)) {
  fs.copyFileSync(marketingPdfSrc, path.join(PDF_DIR, "digital-marketing-plan.pdf"));
}

/* ============================================================
   2. PURE-NODE CRC32 + STORE/DEFLATE ZIP ARCHIVE BUILDER
   ============================================================ */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function buildZipBuffer(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name.replace(/\\/g, "/"), "utf8");
    const rawBuf = Buffer.isBuffer(entry.content) ? entry.content : Buffer.from(entry.content, "utf8");
    const compressed = zlib.deflateRawSync(rawBuf, { level: 9 });
    const useDeflate = compressed.length < rawBuf.length;
    const dataBuf = useDeflate ? compressed : rawBuf;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(rawBuf);

    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0x0800, 6); // UTF-8
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(0x5000, 10); // time
    localHeader.writeUInt16LE(0x5b7c, 12); // date
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(dataBuf.length, 18);
    localHeader.writeUInt32LE(rawBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    localParts.push(localHeader, dataBuf);

    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(0x5000, 12);
    centralHeader.writeUInt16LE(0x5b7c, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(dataBuf.length, 20);
    centralHeader.writeUInt32LE(rawBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBuf.length;
  }

  const centralSize = centralParts.reduce((s, b) => s + b.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...centralParts, eocd]);
}

/* ============================================================
   3. DSP 16-BIT 44.1kHz PCM WAV SOUND EFFECTS GENERATOR
   ============================================================ */
function synthesizeWav(durationSec, sampleFn) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let seed = 1337;
  const nextNoise = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed / 0xffffffff) * 2 - 1;
  };

  let lp = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / durationSec;
    const n = nextNoise();
    lp = lp * 0.92 + n * 0.08;
    const raw = sampleFn(t, progress, n, lp);
    const clamped = Math.max(-0.98, Math.min(0.98, raw));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  return buffer;
}

const audioSpecs = {
  "quattro-boom.wav": [
    1.6,
    (t, p, n, lp) => {
      const freq = 140 * Math.pow(0.24, Math.min(1, p * 1.4));
      const env = Math.exp(-3.2 * t) * Math.min(1, t * 80);
      return (Math.sin(2 * Math.PI * freq * t) * 0.78 + lp * 0.45 * Math.exp(-6 * t)) * env;
    },
  ],
  "welcome-chime.wav": [
    1.4,
    (t) => {
      const n1 = Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-3.5 * t);
      const n2 = t > 0.14 ? Math.sin(2 * Math.PI * 659.25 * (t - 0.14)) * Math.exp(-3.2 * (t - 0.14)) : 0;
      const n3 = t > 0.28 ? Math.sin(2 * Math.PI * 783.99 * (t - 0.28)) * Math.exp(-2.8 * (t - 0.28)) : 0;
      const n4 = t > 0.42 ? Math.sin(2 * Math.PI * 1046.5 * (t - 0.42)) * Math.exp(-2.5 * (t - 0.42)) : 0;
      return (n1 + n2 + n3 + n4) * 0.42;
    },
  ],
  "explosion-impact.wav": [
    2.2,
    (t, p, n, lp) => {
      const subFreq = 110 * Math.exp(-2.8 * t) + 28;
      const boom = Math.sin(2 * Math.PI * subFreq * t) * Math.exp(-2.1 * t);
      const crack = (n * 0.6 + lp * 0.8) * Math.exp(-3.4 * t);
      return (boom * 0.65 + crack * 0.55) * Math.min(1, t * 180);
    },
  ],
  "item-collected.wav": [
    0.8,
    (t) => {
      const a = Math.sin(2 * Math.PI * 987.77 * t) * Math.exp(-14 * t);
      const b = t > 0.07 ? Math.sin(2 * Math.PI * 1318.51 * (t - 0.07)) * Math.exp(-8 * (t - 0.07)) : 0;
      return (a + b) * 0.6;
    },
  ],
  "toon-drops.wav": [
    0.9,
    (t, p) => {
      const freq = 900 * Math.exp(-3.0 * p) + 180 * Math.sin(2 * Math.PI * 14 * t);
      const env = Math.sin(Math.PI * p);
      return Math.sin(2 * Math.PI * Math.max(90, freq) * t) * env * 0.65;
    },
  ],
  "platform-hit.wav": [
    0.65,
    (t) => {
      const tone = Math.sin(2 * Math.PI * (340 * Math.exp(-9 * t) + 120) * t);
      return tone * Math.exp(-11 * t) * 0.85;
    },
  ],
  "cinematic-whoosh.wav": [
    1.5,
    (t, p, n, lp) => {
      const bell = Math.sin(Math.PI * p) ** 1.6;
      const sweep = Math.sin(2 * Math.PI * (90 + 260 * p) * t) * 0.25;
      return (lp * 1.4 + sweep) * bell;
    },
  ],
  "mechanical-keyboard.wav": [
    1.2,
    (t, _p, n) => {
      const hits = [0.05, 0.22, 0.36, 0.55, 0.71, 0.92];
      let out = 0;
      for (const h of hits) {
        const dt = t - h;
        if (dt >= 0 && dt < 0.04) {
          out += (Math.sin(2 * Math.PI * 1600 * dt) * 0.4 + n * 0.5) * Math.exp(-140 * dt);
        }
      }
      return out * 0.9;
    },
  ],
  "rain-thunder.wav": [
    2.6,
    (t, p, n, lp) => {
      const fade = Math.min(1, t * 4) * Math.min(1, (1 - p) * 4);
      const rain = n * 0.14 + lp * 0.24;
      const thunder = t > 0.7 ? Math.sin(2 * Math.PI * 48 * t + lp * 2) * Math.exp(-1.5 * (t - 0.7)) * 0.55 : 0;
      return (rain + thunder) * fade;
    },
  ],
  "cyber-shield.wav": [
    1.7,
    (t, p, _n, lp) => {
      const carrier = Math.sin(2 * Math.PI * (140 + 520 * p) * t);
      const lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * (8 + 20 * p) * t);
      const env = Math.sin(Math.PI * p);
      return (carrier * lfo * 0.65 + lp * 0.18) * env;
    },
  ],
  "espresso-pour.wav": [
    1.8,
    (t, p, n, lp) => {
      const bubble = Math.sin(2 * Math.PI * (420 + 280 * Math.sin(19 * t)) * t) * 0.18;
      const clink = t > 1.25 ? Math.sin(2 * Math.PI * 2420 * (t - 1.25)) * Math.exp(-16 * (t - 1.25)) * 0.55 : 0;
      return ((lp * 0.6 + n * 0.12 + bubble) * Math.sin(Math.PI * p) + clink) * 0.75;
    },
  ],
  "stadium-applause.wav": [
    2.4,
    (t, p, n, lp) => {
      const mod = 0.7 + 0.3 * Math.sin(2 * Math.PI * 7 * t);
      const env = Math.min(1, t * 3) * Math.min(1, (1 - p) * 2.5);
      return (n * 0.35 + lp * 0.85) * mod * env * 0.85;
    },
  ],
  "subway-departure.wav": [
    2.3,
    (t, p, _n, lp) => {
      const engine = Math.sin(2 * Math.PI * (55 + 45 * p) * t) + 0.5 * Math.sin(2 * Math.PI * (110 + 90 * p) * t);
      const rail = ((Math.floor(t * 5) % 2 === 0 && (t * 5) % 1 < 0.18) ? 0.3 : 0) * lp;
      return (engine * 0.35 + rail + lp * 0.3) * Math.sin(Math.PI * p);
    },
  ],
  "industrial-press.wav": [
    1.5,
    (t, _p, n, lp) => {
      const hiss = lp * Math.exp(-6 * t) * 0.55;
      const slam = t > 0.25 ? Math.sin(2 * Math.PI * (90 * Math.exp(-5 * (t - 0.25)) + 32) * (t - 0.25)) * Math.exp(-2.8 * (t - 0.25)) * 0.85 : 0;
      const metallic = t > 0.25 ? n * Math.exp(-14 * (t - 0.25)) * 0.45 : 0;
      return hiss + slam + metallic;
    },
  ],
  "trailer-braam.wav": [
    2.4,
    (t, p) => {
      const bass = Math.sin(2 * Math.PI * 46 * t) + 0.6 * Math.sin(2 * Math.PI * 92 * t) + 0.3 * Math.sin(2 * Math.PI * 138 * t);
      const shaped = Math.tanh(bass * 1.6);
      const env = Math.min(1, t * 12) * Math.exp(-1.15 * t) * (1 - Math.pow(p, 6));
      return shaped * env * 0.65;
    },
  ],
  "crystal-transition.wav": [
    1.1,
    (t, p) => {
      const chime =
        Math.sin(2 * Math.PI * 1567.98 * t) * 0.4 +
        Math.sin(2 * Math.PI * 2093.0 * t) * 0.35 +
        Math.sin(2 * Math.PI * 2637.02 * t) * 0.25;
      return chime * Math.sin(Math.PI * p) * Math.exp(-2.2 * t);
    },
  ],
};

const generatedWavBuffers = {};
for (const [filename, [dur, fn]] of Object.entries(audioSpecs)) {
  const wav = synthesizeWav(dur, fn);
  generatedWavBuffers[filename] = wav;
  fs.writeFileSync(path.join(AUDIO_DIR, filename), wav);
}

/* ============================================================
   4. PURE-NODE STUDIO PNG COVER GENERATOR (800x600 RGB PNG)
   ============================================================ */
function makePngCover(filename, c1, c2, c3, width = 800, height = 600) {
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    raw[rowStart] = 0; // filter None
    const ty = y / height;
    for (let x = 0; x < width; x++) {
      const tx = x / width;
      const idx = rowStart + 1 + x * 3;
      const dx = tx - 0.5;
      const dy = ty - 0.45;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - dist * 1.9);
      const border = x > 36 && x < width - 36 && y > 36 && y < height - 36 && (x < 40 || x > width - 40 || y < 40 || y > height - 40);
      const band = Math.abs(ty - 0.72) < 0.004 && tx > 0.14 && tx < 0.86;

      let r = c1[0] * (1 - tx) + c2[0] * tx + c3[0] * glow * 0.65;
      let g = c1[1] * (1 - ty) + c2[1] * ty + c3[1] * glow * 0.65;
      let b = c1[2] * (1 - tx * 0.5) + c2[2] * tx + c3[2] * glow * 0.75;
      if (border || band) {
        r = Math.min(255, r + 55);
        g = Math.min(255, g + 55);
        b = Math.min(255, b + 65);
      }
      raw[idx] = Math.min(255, Math.max(0, Math.round(r)));
      raw[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      raw[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  const idat = zlib.deflateSync(raw, { level: 6 });

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(CATALOG_IMG_DIR, filename), png);
}

makePngCover("creator-wealth-cover.png", [16, 20, 42], [44, 62, 120], [110, 205, 165], 800, 1000);
makePngCover("habit-systems-cover.png", [22, 18, 38], [84, 52, 130], [235, 168, 92], 800, 1000);
makePngCover("agency-blueprint-cover.png", [14, 28, 36], [28, 88, 104], [120, 210, 235], 800, 1000);
makePngCover("retention-guide-cover.png", [30, 16, 36], [118, 34, 92], [244, 120, 168], 800, 1000);
makePngCover("video-bundle-cover.png", [14, 16, 28], [46, 56, 118], [96, 178, 250], 1000, 750);
makePngCover("cinematic-reels-cover.png", [18, 18, 26], [88, 36, 98], [245, 165, 86], 1000, 750);

/* ============================================================
   5. MULTI-PAGE FORMATTED PDF 1.4 GENERATOR
   ============================================================ */
function escapePdfText(str) {
  return String(str)
    .replace(/[^\x20-\x7e]/g, "-")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildMultiPagePdf({ title, subtitle, author = "BADARSH Creative Studio", sections }) {
  const objects = [];
  const pageObjectIds = [];

  const catalogId = 1;
  const pagesId = 2;
  const fontRegularId = 3;
  const fontBoldId = 4;
  let nextId = 5;

  const pageStreams = [];
  // Cover page
  const coverCmds = [
    "q",
    "0.08 0.09 0.14 rg 0 0 595 842 re f",
    "0.24 0.38 0.92 rg 48 748 92 4 re f",
    "BT /F2 26 Tf 0.98 0.98 0.99 rg 48 700 Td (" + escapePdfText(title.slice(0, 56)) + ") Tj ET",
    "BT /F1 13 Tf 0.76 0.80 0.90 rg 48 664 Td (" + escapePdfText(subtitle.slice(0, 82)) + ") Tj ET",
    "BT /F2 11 Tf 0.56 0.66 0.95 rg 48 618 Td (Author & Publisher: " + escapePdfText(author) + ") Tj ET",
    "0.16 0.19 0.28 rg 48 560 499 1 re f",
    "BT /F1 11 Tf 0.82 0.85 0.92 rg 48 525 Td (Commercial & Personal License Included - www.badarsh.com) Tj ET",
    "BT /F1 10 Tf 0.58 0.62 0.72 rg 48 72 Td (BADARSH Digital Asset Library - Bengaluru, India) Tj ET",
    "Q",
  ];
  pageStreams.push(coverCmds.join("\n"));

  // Content pages (2 sections per page)
  for (let i = 0; i < sections.length; i += 2) {
    const cmds = ["q", "0.99 0.99 1.0 rg 0 0 595 842 re f"];
    cmds.push("0.93 0.94 0.97 rg 48 790 499 24 re f");
    cmds.push("BT /F2 9 Tf 0.30 0.34 0.45 rg 58 799 Td (" + escapePdfText(title.slice(0, 68)) + ") Tj ET");
    let y = 742;
    for (const sec of sections.slice(i, i + 2)) {
      cmds.push("BT /F2 15 Tf 0.09 0.11 0.18 rg 48 " + y + " Td (" + escapePdfText(sec.heading) + ") Tj ET");
      y -= 24;
      for (const line of sec.lines) {
        cmds.push("BT /F1 10.5 Tf 0.24 0.27 0.34 rg 48 " + y + " Td (" + escapePdfText(line) + ") Tj ET");
        y -= 17;
      }
      y -= 22;
    }
    const pageNum = Math.floor(i / 2) + 2;
    cmds.push("BT /F1 9 Tf 0.48 0.52 0.60 rg 48 44 Td (BADARSH Original Edition  |  Page " + pageNum + ") Tj ET");
    cmds.push("Q");
    pageStreams.push(cmds.join("\n"));
  }

  for (const streamText of pageStreams) {
    const contentId = nextId++;
    const pageId = nextId++;
    pageObjectIds.push(pageId);
    objects.push({
      id: contentId,
      body: `<< /Length ${Buffer.byteLength(streamText, "utf8")} >>\nstream\n${streamText}\nendstream`,
    });
    objects.push({
      id: pageId,
      body: `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    });
  }

  const allObjects = [
    { id: catalogId, body: `<< /Type /Catalog /Pages ${pagesId} 0 R >>` },
    { id: pagesId, body: `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>` },
    { id: fontRegularId, body: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>` },
    { id: fontBoldId, body: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>` },
    ...objects,
  ].sort((a, b) => a.id - b.id);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of allObjects) {
    offsets[obj.id] = Buffer.byteLength(pdf, "utf8");
    pdf += `${obj.id} 0 obj\n${obj.body}\nendobj\n`;
  }
  const xrefPos = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${allObjects.length + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= allObjects.length; id++) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${allObjects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  return Buffer.from(pdf, "utf8");
}

const pdfDocs = {
  "creator-wealth-cashflow-playbook.pdf": {
    title: "Creator Wealth & Cashflow Playbook (2026 Edition)",
    subtitle: "Practical Pricing, Digital Asset Funnels & Revenue Systems for Solo Creators",
    sections: [
      {
        heading: "1. Trading Hours for Recurring Digital Assets",
        lines: [
          "Service agencies cap revenue at weekly billable editing or design hours.",
          "By packaging presets, LUTs, templates, and documentation once, every hour of creation",
          "compounds across hundreds of creator checkouts without incremental delivery cost.",
          "Checklist: (1) Identify 3 repeated client requests, (2) Standardize reusable presets,",
          "(3) Publish documentation + preview assets, (4) Bundle complimentary tools into tiers.",
        ],
      },
      {
        heading: "2. The 4-Bucket Creator Cashflow Allocation",
        lines: [
          "- 40% Runway & Tax Reserve: Separate current account before owner distributions.",
          "- 25% Equipment & Software Upgrade Fund: Lens, storage, cloud backup & licensing.",
          "- 20% Distribution & Creative Experiments: Short-form hooks and landing page tests.",
          "- 15% Owner Profit Draw: Reward consistency every 30 days on the 1st of the month.",
        ],
      },
      {
        heading: "3. Product Ladder Pricing Strategy (INR)",
        lines: [
          "Entry Hook (Free - Rs 99): Single utility preset or starter WAV pack to verify quality.",
          "Core Pack (Rs 199 - Rs 399): Targeted workflow pack (Reels hooks, Pitch deck, Presets).",
          "Flagship Vault (Rs 699 - Rs 999): All-in bundle saving 60% vs individual asset SKUs.",
          "Done-For-You Retainer (Rs 4,999+): Custom video editing & Next.js storefront builds.",
        ],
      },
      {
        heading: "4. Monthly Unit Economics Tracking Sheet",
        lines: [
          "Track 5 weekly KPIs: Landing Page Conversion %, Average Order Value (AOV),",
          "Payment Completion Ratio, Support Ticket Rate (<2%), and Repeat Customer Share.",
          "Always deliver verifiable file previews before checkout so buyers know exact quality.",
        ],
      },
    ],
  },
  "daily-creator-habit-systems.pdf": {
    title: "Daily Creator Systems: 30-Day Production Blueprint",
    subtitle: "Batch Filming, Color Pipelines & Zero-Friction Publishing Routines",
    sections: [
      {
        heading: "1. The 45-Minute Morning Creation Block",
        lines: [
          "Great short-form output depends on eliminating setup friction, not willpower.",
          "Keep camera white balance, key light position, lav mic levels, and NLE project",
          "templates permanently saved so recording begins within 90 seconds of sitting down.",
        ],
      },
      {
        heading: "2. Weekly Batching Cadence",
        lines: [
          "- Monday: Research 10 visual hooks & script 4 talking-head bullets per topic.",
          "- Tuesday: Record 4 A-roll videos + 8 B-roll atmospheric cutaways in one session.",
          "- Wednesday: Rough assembly cut + SFX risers & whoosh markers.",
          "- Thursday: Apply Rec.709 color preset + dynamic captions & export 4K 60fps.",
          "- Friday-Sunday: Publish, audit 3-second retention drop-offs, archive winning cuts.",
        ],
      },
      {
        heading: "3. Non-Negotiable Daily Habit Scorecard",
        lines: [
          "[ ] Zero phone scrolling before completing 45m deep creative output",
          "[ ] Name & archive all footage in YYYY-MM-DD_Project folders immediately",
          "[ ] Export clean master + vertical 9:16 crop with peaking check at -1dBFS",
        ],
      },
      {
        heading: "4. Breaking Creative Burnout",
        lines: [
          "Maintain a 10-post evergreen buffer stored in Google Drive / R2 before traveling.",
          "When energy dips, publish behind-the-scenes breakdown or preset before/after slides.",
        ],
      },
    ],
  },
  "freelance-to-founder-blueprint.pdf": {
    title: "Freelance to Agency Founder Blueprint",
    subtitle: "Transitioning From One-Off Edits to Productized Retainers & Digital Storefronts",
    sections: [
      {
        heading: "1. Escaping Custom Quote Fatigue",
        lines: [
          "Replace ambiguous hourly bids with 3 clearly scoped tiers: Starter, Growth, Studio.",
          "Define deliverables, exact turnaround SLAs (24h/48h), and included revision rounds",
          "in writing before taking a 50% kickoff milestone deposit.",
        ],
      },
      {
        heading: "2. Productizing Video & Web Services",
        lines: [
          "- Weekly Reels Retainer: 8 edited vertical clips + SFX design + custom thumbnails.",
          "- Conversion Landing Build: Next.js App Router, Core Web Vitals optimization, SEO.",
          "- Licensing Addendum: Every client delivery transfers commercial publishing rights.",
        ],
      },
      {
        heading: "3. Client Onboarding & Handoff SOP",
        lines: [
          "Step 1: Automated intake form collecting brand fonts, hex codes, & reference links.",
          "Step 2: Shared cloud folder structure (01_Raw, 02_Project, 03_Exports, 04_Final).",
          "Step 3: Timestamped review link instead of scattered WhatsApp voice notes.",
        ],
      },
      {
        heading: "4. Building Secondary Passive Revenue",
        lines: [
          "Package anonymized project structures, LUTs, and component systems into your digital",
          "shop so prospects who cannot yet afford full agency retainers still become buyers.",
        ],
      },
    ],
  },
  "attention-retention-design-guide.pdf": {
    title: "Reels Retention & Hook Architecture Guide",
    subtitle: "Visual Pacing, Audio Cue Timing & Carousel Conversion Mechanics",
    sections: [
      {
        heading: "1. The First 1.8 Seconds Rule",
        lines: [
          "Viewers decide whether to stay within 45 frames on mobile feeds.",
          "Combine a visual motion cut (frame-0 scale punch or lighting shift) with a crisp",
          "high-pass whoosh or sub-boom at +0.05s and readable 5-word thesis overlay.",
        ],
      },
      {
        heading: "2. Pattern Interrupt Rhythm",
        lines: [
          "- Reset viewer attention every 2.5 to 4 seconds via framing shift or B-roll overlay.",
          "- Layer subtle ambient room tone (-28 dBFS) beneath voiceover to feel cinematic.",
          "- Duck dialogue track dynamically before impactful risers and headline reveals.",
        ],
      },
      {
        heading: "3. LinkedIn & Instagram Carousel Flow",
        lines: [
          "Slide 1: High-contrast outcome statement + clear audience label.",
          "Slide 2: Relatable bottleneck metrics showing why old habits stall growth.",
          "Slides 3-6: One actionable diagram or step per slide (max 28 words per card).",
          "Final Slide: Single next action (Bookmark, Download Starter Pack, or Book Call).",
        ],
      },
      {
        heading: "4. Export Spec Checklist",
        lines: [
          "Reels / Shorts: 1080x1920, H.264 High Profile, 20-35 Mbps VBR, 30 or 60fps.",
          "LinkedIn Carousels: 1080x1350 PDF document export, 150 DPI crisp vector typography.",
        ],
      },
    ],
  },
  "365-day-content-planner.pdf": {
    title: "365-Day Social Media Content Planner",
    subtitle: "Annual Publishing Matrix, Hook Library & Campaign Tracker",
    sections: [
      {
        heading: "Quarter 1 - Q4 Campaign Pillars",
        lines: [
          "Pillar A (40%): Educational Tutorials, Color Breakdown & Workflow Fixes.",
          "Pillar B (30%): Case Studies, Before/After Transformation & Client Proof.",
          "Pillar C (20%): Founder Perspective, Gear/Tool Opinions & Industry Takes.",
          "Pillar D (10%): Direct Product & Service Launch Announcements.",
        ],
      },
      {
        heading: "Monthly Hook Prompt Vault",
        lines: [
          "1. 'Stop doing [common mistake] in your Premiere/CapCut timeline - try this instead.'",
          "2. '3 audio layering tricks that make smartphone footage sound studio-mixed.'",
          "3. 'I rebuilt this client homepage for under 1.2s LCP - full stack breakdown.'",
          "4. 'Every preset & LUT I actually reach for on 90% of commercial shoots.'",
        ],
      },
      {
        heading: "Weekly Publishing Matrix",
        lines: [
          "Mon: Tutorial Reel | Tue: Carousel Breakdown | Thu: Case Study | Sat: Tool Drop",
          "Audit Sunday: Record Watch Time %, Saves, Profile Visits, and Store Clicks.",
        ],
      },
    ],
  },
  "freelance-client-tracker.pdf": {
    title: "Freelance & Agency Client Tracker System",
    subtitle: "Lead Pipeline, Scope Agreement, Invoice Milestones & Retention OS",
    sections: [
      {
        heading: "Pipeline Stages & Weekly Review",
        lines: [
          "Stages: Lead Captured -> Discovery Scheduled -> Proposal Sent -> 50% Paid ->",
          "In Production -> Revision Review -> Final Delivered -> Retainer / Referral.",
          "Rule: Never begin heavy production work before written scope & kickoff deposit.",
        ],
      },
      {
        heading: "Standard Scope & Payment Terms",
        lines: [
          "Milestone 1 (50%): Due on kickoff to lock studio production calendar.",
          "Milestone 2 (50%): Due upon watermarked final cut approval prior to raw handoff.",
          "Includes up to 2 consolidated revision rounds within 7 days of preview link.",
        ],
      },
      {
        heading: "Invoice & Follow-Up Schedule",
        lines: [
          "Send reminder +3 days before due date; include UPI / Cashfree payment link directly.",
          "Follow up 30 days post-launch with analytics check-in & maintenance retainer offer.",
        ],
      },
    ],
  },
  "2026-life-career-fitness-planner.pdf": {
    title: "2026 Life, Career & Fitness Operating Planner",
    subtitle: "90-Day Sprints, Habit Cadence, Career Goals & Training Log",
    sections: [
      {
        heading: "1. Annual Direction & 90-Day Focus",
        lines: [
          "Pick max 2 career milestones and 1 measurable health goal per 90-day sprint.",
          "Split Q1-Q4 into 12-week execution sprints with clear Sunday 15-minute audits.",
        ],
      },
      {
        heading: "2. Weekly Time-Blocking Template",
        lines: [
          "07:30 - 08:30: Strength / Conditioning | 09:30 - 12:30: Deep Creation Block",
          "14:00 - 17:00: Client Execution & Admin | 18:00: Shutdown & Next-Day Top 3",
        ],
      },
      {
        heading: "3. Weekly Review & Reset Checklist",
        lines: [
          "[ ] Training sessions completed (Target: 4/week)",
          "[ ] Deep creative hours logged (Target: 15+ hrs)",
          "[ ] Savings transfer & invoice ledger reconciled",
        ],
      },
    ],
  },
  "90-day-fitness-operating-system.pdf": {
    title: "The 90-Day Lean Bulk & Strength Operating System",
    subtitle: "Progressive Overload Split, High-Protein Macro Guide & Weekly Check-Ins",
    sections: [
      {
        heading: "Phase 1 (Weeks 1-4): Foundation & Hypertrophy Volume",
        lines: [
          "4-Day Upper / Lower Split: Focus on strict eccentric tempo (2-3s negative).",
          "Key Lifts: Incline Dumbbell Press, Weighted Pull-Up, RDL, Bulgarian Split Squat.",
          "Target RPE: Leave 2 reps in reserve on compound sets; track every rep.",
        ],
      },
      {
        heading: "Phase 2 & 3 (Weeks 5-12): Progressive Overload & Lean Nutrition",
        lines: [
          "Caloric Target: +250 kcal modest surplus above TDEE; 1.8g protein / kg body weight.",
          "Hydration & Sleep: Minimum 3.5L water daily and 7.5 hours consistent sleep window.",
          "Weigh-in 3 mornings/week and take bi-weekly progress photos in identical lighting.",
        ],
      },
    ],
  },
  "little-legends-coloring-pack.pdf": {
    title: "Little Legends: 50-Page Printable Drawing & Activity Pack",
    subtitle: "Dinosaurs, Space Rockets, Vehicles & Super-Hero Print Sheet Guide",
    sections: [
      {
        heading: "Printable Printing Settings (A4 / US Letter)",
        lines: [
          "Set printer scale to 'Fit to Page' on 120gsm+ heavyweight matte sketching paper.",
          "Includes themed activity prompts: Space Explorer Grid, Dino Valley, Turbo Racers,",
          "Deep Sea Submarine, Medieval Castle, and Robot Lab Trace & Color sheets.",
        ],
      },
      {
        heading: "Parent & Classroom Usage Guide",
        lines: [
          "Approved for unlimited home printing and school classroom handouts.",
          "Tip: Laminate favorite maze pages for reusable dry-erase marker practice.",
        ],
      },
    ],
  },
};

const generatedPdfBuffers = {};
for (const [filename, spec] of Object.entries(pdfDocs)) {
  const buf = buildMultiPagePdf(spec);
  generatedPdfBuffers[filename] = buf;
  fs.writeFileSync(path.join(PDF_DIR, filename), buf);
}

/* ============================================================
   6. REAL CREATOR ASSETS (.cube LUT, .xmp, .xml, SVG, CSV, README)
   ============================================================ */
function buildCubeLut(title, warmShift = 0.04, contrastBoost = 1.08) {
  const lines = [
    `TITLE "${title}"`,
    `# Generated by BADARSH Color Lab (www.badarsh.com)`,
    `LUT_3D_SIZE 17`,
    `DOMAIN_MIN 0.0 0.0 0.0`,
    `DOMAIN_MAX 1.0 1.0 1.0`,
  ];
  const n = 17;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const sCurve = (v) => clamp((v - 0.5) * contrastBoost + 0.5);
  for (let b = 0; b < n; b++) {
    for (let g = 0; g < n; g++) {
      for (let r = 0; r < n; r++) {
        const rn = r / (n - 1);
        const gn = g / (n - 1);
        const bn = b / (n - 1);
        const outR = sCurve(rn + warmShift * rn * (1 - rn));
        const outG = sCurve(gn + (warmShift * 0.25) * gn * (1 - gn));
        const outB = sCurve(bn - warmShift * 0.65 * bn * (1 - bn));
        lines.push(`${outR.toFixed(6)} ${outG.toFixed(6)} ${outB.toFixed(6)}`);
      }
    }
  }
  return lines.join("\n") + "\n";
}

function buildLightroomXmp(name, tempShift = 6, contrast = 14, saturation = -8, vibrance = 12) {
  return `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
    crs:PresetType="Normal"
    crs:Name="${name}"
    crs:Version="16.0"
    crs:ProcessVersion="15.4"
    crs:IncrementalTemperature="${tempShift}"
    crs:Contrast2012="${contrast}"
    crs:Highlights2012="-28"
    crs:Shadows2012="22"
    crs:Whites2012="-10"
    crs:Blacks2012="-14"
    crs:Texture="8"
    crs:Clarity2012="10"
    crs:Vibrance="${vibrance}"
    crs:Saturation="${saturation}">
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
`;
}

function buildAlightMotionXml(name, effectType = "velocity-shake") {
  return `<?xml version="1.0" encoding="utf-8"?>
<scene title="${name}" width="1080" height="1920" fps="60" totalTime="8000" bgcolor="#ff0c0d14">
  <note>BADARSH Official Alight Motion Preset (${effectType}) - Import via Alight Motion XML Import</note>
  <media>
    <shape id="bg_plate" startTime="0" endTime="8000" s=".rect">
      <property name="size" type="vec2" value="540.0,960.0" />
      <transform>
        <location value="540.0,960.0,0.0" />
        <scale>
          <kf t="0.000" v="1.12,1.12" />
          <kf t="0.180" v="1.00,1.00" easing="cubicBezier 0.16 1 0.3 1" />
          <kf t="0.650" v="1.04,1.04" />
        </scale>
      </transform>
      <effect id="com.alightcreative.effects.motionblur" />
      <effect id="com.alightcreative.effects.oscillate">
        <property name="angle" type="float" value="45.0" />
        <property name="freq" type="float" value="2.4" />
        <property name="mag" type="float" value="${effectType === "glitch-rgb" ? "38.0" : "18.0"}" />
      </effect>
    </shape>
  </media>
</scene>
`;
}

function buildSvgCard(title, width = 1080, height = 1920, accent = "#6366f1") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#172038" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" rx="36" />
  <rect x="64" y="64" width="${width - 128}" height="${height - 128}" fill="none" stroke="${accent}" stroke-width="3" rx="24" opacity="0.55" />
  <text x="96" y="160" fill="${accent}" font-family="Arial, sans-serif" font-size="28" font-weight="bold">BADARSH CREATOR TEMPLATE</text>
  <text x="96" y="${Math.round(height * 0.48)}" fill="#ffffff" font-family="Arial, sans-serif" font-size="64" font-weight="bold">${title}</text>
  <text x="96" y="${Math.round(height * 0.55)}" fill="#94a3b8" font-family="Arial, sans-serif" font-size="32">Edit text &amp; brand accent in Figma, Illustrator, Canva, or browser.</text>
</svg>
`;
}

const LICENSE_TXT = `BADARSH COMMERCIAL DIGITAL ASSET LICENSE
Website: https://www.badarsh.com
Support: hello@badarsh.com

1. Permitted Uses: Unlimited personal & commercial client projects (YouTube, Instagram Reels, ads, podcasts, client websites).
2. Prohibited Uses: Reselling, redistributing, or sharing raw unpacked files as your own digital store bundle.
`;

/* ============================================================
   7. WRITE ALL REAL MULTI-FILE ZIP PACKAGES
   ============================================================ */
const zips = {
  "instagram-reels-template-pack.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Templates_SVG/01_Reels_Hook_Minimal.svg", content: buildSvgCard("REELS HOOK // EDIT TEXT", 1080, 1920, "#38bdf8") },
    { name: "Templates_SVG/02_Story_Split_Headline.svg", content: buildSvgCard("3 WAYS TO 2X RETENTION", 1080, 1920, "#818cf8") },
    { name: "Templates_SVG/03_Product_Drop_Cover.svg", content: buildSvgCard("CREATOR KIT // 2026", 1080, 1920, "#34d399") },
    { name: "Color_LUTs/Reels_Clean_Pop.cube", content: buildCubeLut("Reels Clean Pop", 0.03, 1.08) },
    { name: "Guides/Reels_Retention_Guide.pdf", content: generatedPdfBuffers["attention-retention-design-guide.pdf"] },
  ],
  "linkedin-carousel-templates.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Carousel_Slides_SVG/01_Cover_Hook.svg", content: buildSvgCard("HIGH-CONVERTING CAROUSEL", 1080, 1350, "#3b82f6") },
    { name: "Carousel_Slides_SVG/02_Framework_Card.svg", content: buildSvgCard("3-STEP SYSTEM", 1080, 1350, "#6366f1") },
    { name: "Carousel_Slides_SVG/03_CTA_Close.svg", content: buildSvgCard("BOOKMARK & SHARE", 1080, 1350, "#10b981") },
    { name: "Guides/Carousel_Copy_Playbook.pdf", content: generatedPdfBuffers["attention-retention-design-guide.pdf"] },
  ],
  "social-media-starter-kit.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Instagram_Feed_SVG/01_Square_Quote.svg", content: buildSvgCard("FOUNDER QUOTE CARD", 1080, 1080, "#f59e0b") },
    { name: "YouTube_Thumbnail_SVG/01_16x9_Thumb.svg", content: buildSvgCard("YT THUMBNAIL BASE", 1280, 720, "#ef4444") },
    { name: "Planners/Content_Calendar_2026.pdf", content: generatedPdfBuffers["365-day-content-planner.pdf"] },
  ],
  "modern-pitch-deck-template.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Slides_SVG/01_Hero_Title.svg", content: buildSvgCard("SERIES-A INVESTOR DECK", 1920, 1080, "#6366f1") },
    { name: "Slides_SVG/02_Problem_Market.svg", content: buildSvgCard("MARKET OPPORTUNITY", 1920, 1080, "#0ea5e9") },
    { name: "Slides_SVG/03_Unit_Economics.svg", content: buildSvgCard("REVENUE & TRACTION", 1920, 1080, "#10b981") },
    { name: "Playbook/Freelance_to_Founder.pdf", content: generatedPdfBuffers["freelance-to-founder-blueprint.pdf"] },
  ],
  "webinar-slide-deck.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Slides_SVG/01_Keynote_Opener.svg", content: buildSvgCard("2026 KEYNOTE DECK", 1920, 1080, "#f97316") },
    { name: "Slides_SVG/02_Offer_Stack.svg", content: buildSvgCard("VALUE & OFFER STACK", 1920, 1080, "#8b5cf6") },
    { name: "Guides/Retention_Playbook.pdf", content: generatedPdfBuffers["attention-retention-design-guide.pdf"] },
  ],
  "ultimate-brand-identity-kit.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Brand_Marks_SVG/01_Monogram_Mark.svg", content: buildSvgCard("BRAND MONOGRAM", 1000, 1000, "#eab308") },
    { name: "Brand_Marks_SVG/02_Brand_Board.svg", content: buildSvgCard("COLOR & TYPE SYSTEM", 1920, 1080, "#6366f1") },
    { name: "Design_Tokens/brand-tokens.json", content: JSON.stringify({ brand: "Studio System", palette: { obsidian: "#0b0f19", accent: "#6366f1", gold: "#eab308" } }, null, 2) },
    { name: "Guides/Agency_Blueprint.pdf", content: generatedPdfBuffers["freelance-to-founder-blueprint.pdf"] },
  ],
  "luxury-business-card-collection.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "Print_300DPI_SVG/Front_Obsidian_Gold.svg", content: buildSvgCard("STUDIO DIRECTOR", 1050, 600, "#eab308") },
    { name: "Print_300DPI_SVG/Back_Minimal_QR.svg", content: buildSvgCard("WWW.BADARSH.COM", 1050, 600, "#cbd5e1") },
  ],
  "business-launch-mega-bundle.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "01_Reels_Cover.svg", content: buildSvgCard("REELS COVER PACK", 1080, 1920, "#6366f1") },
    { name: "02_Pitch_Deck.svg", content: buildSvgCard("STARTUP PITCH DECK", 1920, 1080, "#38bdf8") },
    { name: "03_Client_Tracker.csv", content: "Client,Project,Stage,Milestone_INR,Status\nSample Brand,Reels Retainer,Active,9999,Paid\n" },
    { name: "04_Playbooks/Wealth_Playbook.pdf", content: generatedPdfBuffers["creator-wealth-cashflow-playbook.pdf"] },
    { name: "04_Playbooks/Client_Tracker.pdf", content: generatedPdfBuffers["freelance-client-tracker.pdf"] },
  ],
  "creator-video-editing-tools-config-vault.zip": [
    { name: "README_OFFICIAL_TOOLS_VAULT.txt", content: LICENSE_TXT + "\nIncludes original 4K export settings, DaVinci/Premiere LUTs, and Alight Motion XML presets.\n" },
    { name: "Color_LUTs/Badarsh_Warm_Cinema.cube", content: buildCubeLut("Badarsh Warm Cinema", 0.06, 1.12) },
    { name: "Color_LUTs/Badarsh_Clean_Rec709.cube", content: buildCubeLut("Badarsh Clean Rec709", 0.01, 1.05) },
    { name: "Alight_Motion_XML/Smooth_Velocity.xml", content: buildAlightMotionXml("Smooth Velocity Preset", "velocity-shake") },
    { name: "Export_Presets/4K_60fps_Reels_Bitrate_Specs.json", content: JSON.stringify({ resolution: "1080x1920 / 2160x3840", fps: 60, bitrateMbps: 35, codec: "H.264 High@L5.1", audio: "AAC 320kbps 48kHz" }, null, 2) },
    { name: "Audio_Samples/Cinematic_Whoosh.wav", content: generatedWavBuffers["cinematic-whoosh.wav"] },
  ],
  "vn-video-editor-pro-setup.zip": [
    { name: "README_VN_CREATOR_SETUP.txt", content: LICENSE_TXT + "\nOfficial VN (.cube) LUTs, 4K export guide, and Beat-Sync SFX starter files.\nInstall VN cleanly from Apple App Store / Google Play and import the LUTs folder.\n" },
    { name: "VN_LUTs/VN_Film_Gold.cube", content: buildCubeLut("VN Film Gold", 0.07, 1.10) },
    { name: "VN_LUTs/VN_Moody_Teal.cube", content: buildCubeLut("VN Moody Teal", -0.04, 1.14) },
    { name: "VN_SFX/Quattro_Boom.wav", content: generatedWavBuffers["quattro-boom.wav"] },
    { name: "VN_SFX/Cinematic_Whoosh.wav", content: generatedWavBuffers["cinematic-whoosh.wav"] },
  ],
  "capcut-mobile-creator-suite.zip": [
    { name: "README_EXPORT_SUITE.txt", content: LICENSE_TXT + "\nIncludes 4K 60fps high-bitrate export workflow, LUTs, and audio transition stems.\n" },
    { name: "LUTs/CapCut_Warm_Skin.cube", content: buildCubeLut("CapCut Warm Skin", 0.05, 1.07) },
    { name: "LUTs/CapCut_Crisp_Product.cube", content: buildCubeLut("CapCut Crisp Product", 0.02, 1.11) },
    { name: "SFX/Trailer_Braam.wav", content: generatedWavBuffers["trailer-braam.wav"] },
    { name: "SFX/Crystal_Transition.wav", content: generatedWavBuffers["crystal-transition.wav"] },
    { name: "Guides/Retention_Architecture.pdf", content: generatedPdfBuffers["attention-retention-design-guide.pdf"] },
  ],
  "alight-motion-pro-presets-engine.zip": [
    { name: "README_ALIGHT_MOTION_XML.txt", content: LICENSE_TXT + "\nImport the .xml files directly into Alight Motion via Project -> Import XML.\n" },
    { name: "XML_Presets/01_Velocity_Beat_Shake.xml", content: buildAlightMotionXml("Velocity Beat Shake", "velocity-shake") },
    { name: "XML_Presets/02_Glitch_RGB_Split.xml", content: buildAlightMotionXml("Glitch RGB Split", "glitch-rgb") },
    { name: "LUTs/Motion_Contrast_Pop.cube", content: buildCubeLut("Motion Contrast Pop", 0.03, 1.15) },
  ],
  "lightroom-mobile-preset-injector.zip": [
    { name: "README_LIGHTROOM_PRESETS.txt", content: LICENSE_TXT + "\nImport .xmp files directly into Lightroom Classic / CC (cloud syncs automatically to Lightroom Mobile).\n" },
    { name: "XMP_Presets/01_Editorial_Warmth.xmp", content: buildLightroomXmp("BADARSH Editorial Warmth", 8, 12, -10, 14) },
    { name: "XMP_Presets/02_Moody_Noir_Street.xmp", content: buildLightroomXmp("BADARSH Moody Street", -5, 22, -22, 6) },
    { name: "XMP_Presets/03_Clean_Portrait_Glow.xmp", content: buildLightroomXmp("BADARSH Portrait Glow", 5, 8, -4, 10) },
  ],
  "viral-sfx-motion-overlay-bundle.zip": [
    { name: "README_AND_LICENSE.txt", content: LICENSE_TXT },
    { name: "SFX_WAV/01_Quattro_Boom.wav", content: generatedWavBuffers["quattro-boom.wav"] },
    { name: "SFX_WAV/02_Cinematic_Whoosh.wav", content: generatedWavBuffers["cinematic-whoosh.wav"] },
    { name: "SFX_WAV/03_Explosion_Impact.wav", content: generatedWavBuffers["explosion-impact.wav"] },
    { name: "SFX_WAV/04_Crystal_Transition.wav", content: generatedWavBuffers["crystal-transition.wav"] },
    { name: "Color_LUTs/Viral_Pop.cube", content: buildCubeLut("Viral Pop 3D", 0.04, 1.10) },
  ],
  "cinematic-lightroom-presets.zip": [
    { name: "README_PRESETS_INSTALL.txt", content: LICENSE_TXT },
    { name: "XMP_Desktop_MobileSync/BADARSH_Kodak_Gold.xmp", content: buildLightroomXmp("BADARSH Kodak Gold", 11, 15, -6, 16) },
    { name: "XMP_Desktop_MobileSync/BADARSH_Desert_Editorial.xmp", content: buildLightroomXmp("BADARSH Desert Editorial", 14, 10, -14, 18) },
    { name: "XMP_Desktop_MobileSync/BADARSH_Teal_Shadow.xmp", content: buildLightroomXmp("BADARSH Teal Shadow", -6, 20, -16, 12) },
    { name: "XMP_Desktop_MobileSync/BADARSH_Soft_Skin.xmp", content: buildLightroomXmp("BADARSH Soft Skin", 4, 6, -5, 10) },
    { name: "Color_LUTs/Badarsh_Film_Match.cube", content: buildCubeLut("Badarsh Film Match", 0.05, 1.08) },
  ],
  "2026-video-editing-mega-bundle.zip": [
    { name: "README_MEGA_BUNDLE.txt", content: LICENSE_TXT },
    { name: "SFX/Trailer_Braam.wav", content: generatedWavBuffers["trailer-braam.wav"] },
    { name: "SFX/Explosion_Impact.wav", content: generatedWavBuffers["explosion-impact.wav"] },
    { name: "SFX/Cinematic_Whoosh.wav", content: generatedWavBuffers["cinematic-whoosh.wav"] },
    { name: "LUTs/Cinema_Gold_709.cube", content: buildCubeLut("Cinema Gold 709", 0.06, 1.12) },
    { name: "LUTs/Night_City_Neon.cube", content: buildCubeLut("Night City Neon", -0.05, 1.16) },
    { name: "XML_Presets/Velocity_Shake.xml", content: buildAlightMotionXml("Velocity Shake", "velocity-shake") },
    { name: "XML_Presets/Glitch_RGB.xml", content: buildAlightMotionXml("Glitch RGB", "glitch-rgb") },
    { name: "Guide/Retention_Playbook.pdf", content: generatedPdfBuffers["attention-retention-design-guide.pdf"] },
  ],
  "cinematic-sfx-motion-overlays-pack.zip": [
    { name: "README_SFX_PACK.txt", content: LICENSE_TXT },
    { name: "SFX_WAV/Trailer_Braam.wav", content: generatedWavBuffers["trailer-braam.wav"] },
    { name: "SFX_WAV/Industrial_Press.wav", content: generatedWavBuffers["industrial-press.wav"] },
    { name: "SFX_WAV/Subway_Departure.wav", content: generatedWavBuffers["subway-departure.wav"] },
    { name: "SFX_WAV/Cyber_Shield.wav", content: generatedWavBuffers["cyber-shield.wav"] },
    { name: "SFX_WAV/Rain_Thunder.wav", content: generatedWavBuffers["rain-thunder.wav"] },
  ],
  "badarsh-sfx-vault-master.zip": [
    { name: "README_SFX_VAULT.txt", content: LICENSE_TXT },
    ...Object.entries(generatedWavBuffers).map(([name, buf]) => ({
      name: `24bit_Style_WAV/${name}`,
      content: buf,
    })),
  ],
  "vt-velocity-beat-shake-vol-1.zip": [
    { name: "README_ALIGHT_MOTION.txt", content: LICENSE_TXT },
    { name: "Velocity_Beat_Shake_Vol1.xml", content: buildAlightMotionXml("Velocity Beat Shake Vol 1", "velocity-shake") },
    { name: "Velocity_Hit.wav", content: generatedWavBuffers["platform-hit.wav"] },
    { name: "Clean_Contrast.cube", content: buildCubeLut("Velocity Contrast", 0.02, 1.12) },
  ],
  "vt-kinetic-3d-lyrics.zip": [
    { name: "README_3D_LYRICS.txt", content: LICENSE_TXT },
    { name: "Kinetic_3D_Lyrics.xml", content: buildAlightMotionXml("Kinetic 3D Typography", "lyrics-float") },
    { name: "Crystal_Riser.wav", content: generatedWavBuffers["crystal-transition.wav"] },
  ],
  "vt-glitch-rgb-split.zip": [
    { name: "README_GLITCH_RGB.txt", content: LICENSE_TXT },
    { name: "Glitch_RGB_Split.xml", content: buildAlightMotionXml("Glitch RGB Split", "glitch-rgb") },
    { name: "Glitch_Impact.wav", content: generatedWavBuffers["cyber-shield.wav"] },
  ],
  "vt-cinematic-slow-mo-reels.zip": [
    { name: "README_SLOW_MO.txt", content: LICENSE_TXT },
    { name: "Cinematic_SlowMo_Reel.xml", content: buildAlightMotionXml("Cinematic Slow-Mo Reel", "slow-mo-ease") },
    { name: "Luxury_Warm_Grade.cube", content: buildCubeLut("Luxury Warm Grade", 0.06, 1.09) },
    { name: "Ambient_Whoosh.wav", content: generatedWavBuffers["cinematic-whoosh.wav"] },
  ],
};

for (const [zipName, entries] of Object.entries(zips)) {
  const zipBuf = buildZipBuffer(entries);
  fs.writeFileSync(path.join(DL_DIR, zipName), zipBuf);
}

console.log(
  `Built ${Object.keys(audioSpecs).length} WAVs, ${Object.keys(pdfDocs).length} PDFs, 6 PNGs, and ${Object.keys(zips).length} ZIP archives cleanly.`
);
