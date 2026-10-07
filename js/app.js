const $ = (s) => document.querySelector(s),
  T = {
    en: {
      nav1: "My Map",
      nav2: "Culture",
      nav3: "Coming soon",
      tag: "47 Prefectures · 8 Regions",
      h1: "How much of Japan have you explored?",
      sub: "Pick the prefectures you’ve visited, choose a colour theme, and download a beautiful map of your journey.",
      cta: "Start picking ↓",
      s1: "Pick prefectures",
      s2: "Choose a theme",
      s3: "Download PNG, JPG or PDF",
      visited: "Places I’ve been",
      all: "Select all",
      none: "Clear",
      theme: "Theme",
      photo: "+ Add your photo",
      labels: "Names",
      ctitle: "JAPAN TRAVEL MAP",
      mine: "My Japan",
      tip: "Tip: you can also tap the tiles on the map to select.",
      dl: "Download your map",
      cult: "Culture of Japan",
      soonh: "Coming soon",
      fdesc:
        "Mark the prefectures you’ve visited and make a keepsake map of your Japan.",
      search: "Search prefecture…",
      name: "Your name (optional)",
      of: (n) => `${n} of 47 prefectures`,
      pct: (p) => `${p}% of Japan explored`,
      soon: [
        "World Map",
        "Where to go?",
        "Games",
        "Trip Planner",
        "Hidden Gems",
      ],
      r: 1,
    },
    ja: {
      nav1: "マイマップ",
      nav2: "日本文化",
      nav3: "近日公開",
      tag: "47都道府県 · 8地方",
      h1: "日本をどこまで旅しましたか？",
      sub: "訪れた都道府県を選んで、お気に入りの色を選び、あなただけの旅の地図をダウンロードしましょう。",
      cta: "選びはじめる ↓",
      s1: "都道府県を選ぶ",
      s2: "テーマを選ぶ",
      s3: "PNG・JPG・PDFで保存",
      visited: "行ったことのある場所",
      all: "すべて選択",
      none: "解除",
      theme: "テーマ",
      photo: "+ 写真を追加",
      labels: "名前表示",
      ctitle: "日本旅行マップ",
      mine: "私の日本",
      tip: "ヒント：地図のタイルを直接タップして選ぶこともできます。",
      dl: "地図をダウンロード",
      cult: "日本の文化",
      soonh: "近日公開",
      fdesc: "訪れた都道府県を記録して、あなただけの日本地図を作りましょう。",
      search: "都道府県を検索…",
      name: "お名前（任意）",
      of: (n) => `47都道府県中 ${n}`,
      pct: (p) => `日本の ${p}% を旅しました`,
      soon: [
        "世界地図",
        "どこへ行く？",
        "ゲーム",
        "旅行プランナー",
        "穴場スポット",
      ],
      r: 0,
    },
  };
let lang = "en",
  theme = "sakura",
  sel = new Set(),
  photo = null,
  shown = 0;
try {
  lang = localStorage.lang || lang;
  theme = localStorage.theme || theme;
  sel = new Set(JSON.parse(localStorage.sel || "[]"));
} catch (e) {}
const L = () => T[lang],
  nm = (p) => (lang == "ja" ? p[1] : p[2]),
  save = () => {
    try {
      localStorage.lang = lang;
      localStorage.theme = theme;
      localStorage.sel = JSON.stringify([...sel]);
    } catch (e) {}
  };
function text() {
  document.documentElement.lang = lang;
  document
    .querySelectorAll("[data-i]")
    .forEach((e) => (e.textContent = L()[e.dataset.i]));
  document
    .querySelectorAll("[data-p]")
    .forEach((e) => (e.placeholder = L()[e.dataset.p]));
  $("#lang").textContent = lang == "ja" ? "English" : "日本語";
  $("#cultcards").innerHTML = CULT[lang]
    .map(
      (c) =>
        `<div class="cc sr"><em>${c[0]}</em><h3>${c[1]}</h3><p>${c[2]}</p></div>`,
    )
    .join("");
  $("#soonlist").innerHTML = L()
    .soon.map((s) => `<span>${s}</span>`)
    .join("");
  reveal();
}
function list() {
  const q = $("#q").value.trim().toLowerCase();
  $("#list").innerHTML = Object.keys(REGIONS)
    .map((r) => {
      const ps = P.filter(
        (p) =>
          p[3] == r &&
          (!q || p[1].includes(q) || p[2].toLowerCase().includes(q)),
      );
      if (!ps.length) return "";
      const n = P.filter((p) => p[3] == r && sel.has(p[0])).length,
        t = P.filter((p) => p[3] == r).length;
      return `<div class="rg"><h5><span>${REGIONS[r][lang == "ja" ? 0 : 1]} <small>${n}/${t}</small></span><button data-r="${r}">${L().all}</button></h5>${ps.map((p) => `<button class="chip ${sel.has(p[0]) ? "on" : ""}" data-id="${p[0]}">${nm(p)}</button>`).join("")}</div>`;
    })
    .join("");
}
function grid() {
  $("#grid").innerHTML =
    `<svg viewBox="0 0 437.33 516.02">${P.map((p) => `<path class="jp ${sel.has(p[0]) ? "on" : ""}" data-id="${p[0]}" d="${MAP[p[0]]}"><title>${p[1]} ${p[2]}</title></path>`).join("")}${P.map((p) => `<text class="lb" data-l="${p[0]}">${nm(p)}</text>`).join("")}</svg>`;
  document.querySelectorAll(".lb").forEach((t) => {
    const b = $(`.jp[data-id="${t.dataset.l}"]`).getBBox();
    t.setAttribute("x", b.x + b.width / 2);
    t.setAttribute("y", b.y + b.height / 2);
  });
}
function stats() {
  const n = sel.size,
    p = Math.round((n / 47) * 100);
  $("#cnt").textContent = n + "/47";
  $("#fill").style.width = p + "%";
  $("#pct").textContent = L().pct(p);
  $("#of").textContent = L().of(n);
  const a = shown,
    t0 = performance.now();
  (function f(t) {
    const k = Math.min(1, (t - t0) / 500);
    $("#num").textContent = Math.round(a + (n - a) * k);
    k < 1 ? requestAnimationFrame(f) : (shown = n);
  })(t0);
}
function themeApply() {
  const c = THEMES[theme],
    s = $("#card").style;
  ["--bg", "--ac", "--ink", "--tile"].forEach((v, i) => s.setProperty(v, c[i]));
  document
    .querySelectorAll("#themes button")
    .forEach((b) => b.classList.toggle("on", b.dataset.t == theme));
}
function all() {
  save();
  list();
  grid();
  stats();
}
function toggle(id) {
  sel.has(id) ? sel.delete(id) : sel.add(id);
  all();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-id],[data-r],[data-t],[data-f]");
  if (!b) return;
  if (b.dataset.id) toggle(b.dataset.id);
  else if (b.dataset.r) {
    const ids = P.filter((p) => p[3] == b.dataset.r).map((p) => p[0]),
      full = ids.every((i) => sel.has(i));
    ids.forEach((i) => (full ? sel.delete(i) : sel.add(i)));
    all();
  } else if (b.dataset.t) {
    theme = b.dataset.t;
    save();
    themeApply();
  } else download(b.dataset.f);
});
$("#all").onclick = () => {
  P.forEach((p) => sel.add(p[0]));
  all();
};
$("#none").onclick = () => {
  sel.clear();
  all();
};
$("#q").oninput = list;
$("#name").oninput = (e) => ($("#who").textContent = e.target.value);
$("#labels").onchange = (e) =>
  $("#card").classList.toggle("nolabel", !e.target.checked);
$("#lang").onclick = () => {
  lang = lang == "ja" ? "en" : "ja";
  save();
  text();
  all();
};
$("#photo").onchange = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    photo = new Image();
    photo.onload = () => {
      $("#av").src = photo.src;
      $("#av").hidden = false;
    };
    photo.src = r.result;
  };
  r.readAsDataURL(f);
};
$("#themes").innerHTML = Object.entries(THEMES)
  .map(
    ([k, c]) =>
      `<button data-t="${k}" aria-label="${k}" style="background:linear-gradient(135deg,${c[0]} 50%,${c[1]} 50%);border-color:#0002"></button>`,
  )
  .join("");
/* export */
async function download(f) {
  await document.fonts.ready;
  const W = 1080,
    H = 1350,
    m = 70,
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d"),
    [bg, ac, ink, tile] = THEMES[theme],
    S = "'Shippori Mincho',serif",
    G = "'Zen Kaku Gothic New',sans-serif";
  const rr = (a, b, w, h, r, fill) => {
    x.beginPath();
    x.roundRect(a, b, w, h, r);
    x.fillStyle = fill;
    x.fill();
  };
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);
  x.fillStyle = ink;
  x.globalAlpha = 0.55;
  x.font = `500 22px ${G}`;
  x.fillText(L().ctitle, m, m + 20);
  x.globalAlpha = 1;
  x.font = `800 64px ${S}`;
  x.fillText(L().mine, m, m + 95);
  const nmv = $("#name").value;
  if (nmv) {
    x.globalAlpha = 0.7;
    x.font = `500 28px ${G}`;
    x.fillText(nmv, m, m + 140);
    x.globalAlpha = 1;
  }
  x.textAlign = "right";
  x.fillStyle = ac;
  x.font = `800 120px ${S}`;
  x.fillText(sel.size, W - m - 120, m + 120);
  x.fillStyle = ink;
  x.globalAlpha = 0.5;
  x.font = `500 40px ${S}`;
  x.fillText("/47", W - m, m + 120);
  x.globalAlpha = 1;
  x.textAlign = "left";
  if (photo) {
    x.save();
    x.beginPath();
    x.arc(W - m - 250, m + 75, 45, 0, 7);
    x.clip();
    const s = Math.min(photo.width, photo.height);
    x.drawImage(
      photo,
      (photo.width - s) / 2,
      (photo.height - s) / 2,
      s,
      s,
      W - m - 295,
      m + 30,
      90,
      90,
    );
    x.restore();
    x.beginPath();
    x.arc(W - m - 250, m + 75, 45, 0, 7);
    x.strokeStyle = ac;
    x.lineWidth = 4;
    x.stroke();
  }
  const y0 = 285,
    sc = 860 / 516.02,
    ox = (W - 437.33 * sc) / 2,
    lab = $("#labels").checked;
  P.forEach((p) => {
    const on = sel.has(p[0]);
    x.save();
    x.translate(ox, y0);
    x.scale(sc, sc);
    const d = new Path2D(MAP[p[0]]);
    x.fillStyle = on ? ac : tile;
    x.fill(d);
    x.strokeStyle = bg;
    x.lineWidth = 0.7;
    x.lineJoin = "round";
    x.stroke(d);
    x.restore();
  });
  if (lab) {
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = `700 ${Math.round(6.5 * sc)}px ${G}`;
    x.lineJoin = "round";
    x.lineWidth = 4;
    P.forEach((p) => {
      const b = $(`.jp[data-id="${p[0]}"]`).getBBox(),
        X = ox + (b.x + b.width / 2) * sc,
        Y = y0 + (b.y + b.height / 2) * sc;
      x.strokeStyle = bg;
      x.strokeText(nm(p), X, Y);
      x.fillStyle = ink;
      x.fillText(nm(p), X, Y);
    });
  }
  x.textAlign = "left";
  x.textBaseline = "alphabetic";
  const by = y0 + 860 + 20;
  rr(m, by, W - 2 * m, 14, 7, tile);
  rr(m, by, Math.max(14, ((W - 2 * m) * sel.size) / 47), 14, 7, ac);
  x.fillStyle = ink;
  x.font = `700 24px ${G}`;
  x.fillText(L().pct(Math.round((sel.size / 47) * 100)), m, by + 52);
  x.textAlign = "right";
  x.globalAlpha = 0.6;
  x.font = `400 22px ${G}`;
  x.fillText(L().of(sel.size), W - m, by + 52);
  x.textAlign = "left";
  x.globalAlpha = 1;
  x.beginPath();
  x.arc(m + 12, H - 62, 12, 0, 7);
  x.fillStyle = ac;
  x.fill();
  x.fillStyle = ink;
  x.font = `800 26px ${S}`;
  x.fillText("Unseen Japan", m + 34, H - 53);
  const fn = "my-japan-map";
  if (f == "png") c.toBlob((b) => save2(b, fn + ".png"));
  else if (f == "jpg")
    c.toBlob((b) => save2(b, fn + ".jpg"), "image/jpeg", 0.93);
  else
    c.toBlob(
      async (b) =>
        save2(pdf(new Uint8Array(await b.arrayBuffer()), W, H), fn + ".pdf"),
      "image/jpeg",
      0.93,
    );
}
function save2(b, n) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = n;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4e3);
}
function pdf(img, w, h) {
  const e = (s) => new TextEncoder().encode(s),
    P = [],
    o = [];
  let n = 0;
  const add = (d) => {
      P.push(d);
      n += d.length;
    },
    W = w * 0.6,
    H = h * 0.6;
  add(e("%PDF-1.4\n"));
  o[1] = n;
  add(e("1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"));
  o[2] = n;
  add(e("2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"));
  o[3] = n;
  add(
    e(
      `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Resources<</XObject<</I 4 0 R>>>>/Contents 5 0 R>>endobj\n`,
    ),
  );
  o[4] = n;
  add(
    e(
      `4 0 obj<</Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${img.length}>>stream\n`,
    ),
  );
  add(img);
  add(e("\nendstream endobj\n"));
  const q = `q ${W} 0 0 ${H} 0 0 cm /I Do Q`;
  o[5] = n;
  add(e(`5 0 obj<</Length ${q.length}>>stream\n${q}\nendstream endobj\n`));
  let x = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i < 6; i++)
    x += String(o[i]).padStart(10, "0") + " 00000 n \n";
  add(e(x + `trailer<</Size 6/Root 1 0 R>>\nstartxref\n${n}\n%%EOF`));
  return new Blob(P, { type: "application/pdf" });
}
/* motion */
function reveal() {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach(
        (e) =>
          e.isIntersecting &&
          (e.target.classList.add("v"), io.unobserve(e.target)),
      ),
    { threshold: 0.15 },
  );
  document.querySelectorAll(".sr").forEach((el) => io.observe(el));
}
(function () {
  const c = $("#petals"),
    x = c.getContext("2d");
  let w,
    h,
    ps = [];
  const rs = () => {
    w = c.width = c.offsetWidth;
    h = c.height = c.offsetHeight;
  };
  rs();
  addEventListener("resize", rs);
  for (let i = 0; i < 38; i++)
    ps.push({
      x: Math.random() * 2e3,
      y: Math.random() * 800,
      s: 5 + Math.random() * 7,
      v: 0.4 + Math.random(),
      d: Math.random() * 6,
      a: Math.random() * 6,
    });
  (function f() {
    x.clearRect(0, 0, w, h);
    ps.forEach((p) => {
      p.y += p.v;
      p.x += Math.sin((p.d += 0.02)) * 0.8 + 0.3;
      p.a += 0.02;
      if (p.y > h + 20) {
        p.y = -20;
        p.x = Math.random() * w;
      }
      if (p.x > w + 20) p.x = -20;
      x.save();
      x.translate(p.x, p.y);
      x.rotate(p.a);
      x.scale(1, 0.6 + Math.abs(Math.sin(p.a)) * 0.4);
      x.beginPath();
      x.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, 7);
      x.fillStyle = "rgba(255,205,215,.8)";
      x.fill();
      x.restore();
    });
    requestAnimationFrame(f);
  })();
})();
text();
themeApply();
all();
