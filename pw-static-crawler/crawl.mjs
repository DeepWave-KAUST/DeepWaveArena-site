import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- CLI --------------------
function getArg(name, def) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return def;
}

const START_URL = getArg("url", null);
if (!START_URL) {
  console.error("Usage: node crawl.mjs --url https://example.com [--out out] [--maxPages 500] [--maxClicksPerPage 50] [--sameOrigin true|false] [--headless true|false]");
  process.exit(1);
}

const OUT_DIR = path.resolve(getArg("out", "out"));
const MAX_PAGES = parseInt(getArg("maxPages", "500"), 10);
const MAX_CLICKS_PER_PAGE = parseInt(getArg("maxClicksPerPage", "50"), 10);
const SAME_ORIGIN_ONLY = (getArg("sameOrigin", "true") + "").toLowerCase() !== "false";
const HEADLESS = (getArg("headless", "true") + "").toLowerCase() !== "false";

const START = new URL(START_URL);
const START_ORIGIN = START.origin;

// -------------------- Helpers --------------------
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeFileName(s) {
  return s.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").slice(0, 180);
}

function hash(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function isHttpUrl(u) {
  return u && (u.startsWith("http://") || u.startsWith("https://"));
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    // Drop fragment so we don’t treat same page anchors as different pages
    url.hash = "";
    // Normalize trailing slash for root-ish paths
    // (don’t over-normalize; apps may care)
    return url.toString();
  } catch {
    return null;
  }
}

function isAllowed(urlStr) {
  try {
    const u = new URL(urlStr);
    if (!isHttpUrl(u.toString())) return false;
    if (SAME_ORIGIN_ONLY && u.origin !== START_ORIGIN) return false;
    return true;
  } catch {
    return false;
  }
}

// Map URL -> local html path, deterministic
function pageUrlToLocalHtml(urlStr) {
  const u = new URL(urlStr);
  // Turn pathname into folders; add query hash to avoid collisions
  const q = u.search ? "__q_" + hash(u.search) : "";
  let p = u.pathname;

  // If ends with /, save as index.html
  if (p.endsWith("/")) p += "index";
  // If no extension, treat as folder-like
  const ext = path.extname(p);
  const base = ext ? p.slice(0, -ext.length) : p;

  const parts = base.split("/").filter(Boolean).map(safeFileName);
  const file = (parts.length ? parts[parts.length - 1] : "index") + q + ".html";
  const dirParts = parts.length > 1 ? parts.slice(0, -1) : [];
  return path.join("pages", ...dirParts, file);
}

// Map asset URL -> local file path
function assetUrlToLocalPath(assetUrl) {
    const u = new URL(assetUrl);
  
    // Mirror exact path under out/ (so /static/... becomes out/static/...)
    let p = u.pathname;
    if (!p || p === "/") p = "/_root_";
  
    const q = u.search ? "__q_" + hash(u.search) : "";
    const ext = path.extname(p);
  
    const parts = p.split("/").filter(Boolean).map(safeFileName);
    const fileBase = parts.length ? parts[parts.length - 1] : "_root_";
  
    const file = ext
      ? fileBase.slice(0, -ext.length) + q + ext
      : fileBase + q;
  
    const dirParts = parts.length > 1 ? parts.slice(0, -1) : [];
  
    return path.join(...dirParts, file);
}

function toRelative(fromFile, toFile) {
  const rel = path.relative(path.dirname(fromFile), toFile);
  return rel.startsWith(".") ? rel : "./" + rel;
}

async function writeFileAtomic(filePath, data) {
  ensureDir(path.dirname(filePath));
  const tmp = filePath + ".tmp";
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, filePath);
}

function enqueueCompetitionDetailUrlsFromJson(json) {
    // Best-effort: supports common DRF pagination structures
    const items = Array.isArray(json) ? json
      : Array.isArray(json?.results) ? json.results
      : Array.isArray(json?.data) ? json.data
      : [];
  
    for (const it of items) {
      const id = it?.id ?? it?.pk ?? null;
      const url = it?.url ?? it?.detail_url ?? it?.absolute_url ?? null;
  
      if (url && typeof url === "string") {
        // may be absolute or relative
        try {
          const abs = new URL(url, START_ORIGIN).toString();
          enqueue(abs, "api:competitions:list");
        } catch {}
        continue;
      }
  
      if (id != null) {
        // Codabench typical route:
        enqueue(`${START_ORIGIN}/competitions/${id}`, "api:competitions:list");
        enqueue(`${START_ORIGIN}/competitions/${id}/`, "api:competitions:list");
      }
    }
  }

// -------------------- Core crawler --------------------
ensureDir(OUT_DIR);

const visitedPages = new Set();
const enqueuedPages = new Set();
const assetMap = new Map(); // assetUrl -> localPath (relative inside OUT_DIR)
const downloadedAssets = new Set();

const queue = [];
function enqueue(urlStr, from = "") {
  const n = normalizeUrl(urlStr);
  if (!n) return;
  if (!isAllowed(n)) return;
  if (enqueuedPages.has(n) || visitedPages.has(n)) return;
  enqueuedPages.add(n);
  queue.push({ url: n, from });
}

enqueue(START_URL, "seed");

// Download asset from a Playwright response
async function handleAssetResponse(response) {
  try {
    const url = response.url();

    const u = new URL(url);
    if (u.origin === START_ORIGIN && u.pathname.startsWith("/static/")) {
    // always save anything under /static/
    const localRel = assetMap.get(url) || assetUrlToLocalPath(url);
    assetMap.set(url, localRel);
    if (!downloadedAssets.has(url)) {
        downloadedAssets.add(url);
        const localAbs = path.join(OUT_DIR, localRel);
        ensureDir(path.dirname(localAbs));
        const body = await response.body();
        fs.writeFileSync(localAbs, body);
    }
    return;
    }

    // // Save API JSON too
    // if (u.origin === START_ORIGIN && u.pathname.startsWith("/api/")) {
    //     const localRel = path.join(
    //         "__api__",
    //         u.pathname.replace(/^\/+/, ""),
    //         "index" + (u.search ? "__q_" + hash(u.search) : "") + ".json"
    //     );
    
    //     assetMap.set(url, localRel);
    //     if (!downloadedAssets.has(url)) {
    //     downloadedAssets.add(url);
    //     const localAbs = path.join(OUT_DIR, localRel);
    //     ensureDir(path.dirname(localAbs));
    //     const body = await response.body();
    //     fs.writeFileSync(localAbs, body);
    //     }
    //     return;
    // }

    // Save API JSON too
    if (u.origin === START_ORIGIN && u.pathname.startsWith("/api/")) {
        const localRel = path.join(
        "__api__",
        u.pathname.replace(/^\/+/, ""),
        "index" + (u.search ? "__q_" + hash(u.search) : "") + ".json"
        );
    
        assetMap.set(url, localRel);
    
        if (!downloadedAssets.has(url)) {
        downloadedAssets.add(url);
        const localAbs = path.join(OUT_DIR, localRel);
        ensureDir(path.dirname(localAbs));
        const body = await response.body();
        fs.writeFileSync(localAbs, body);
    
        // 👇 NEW: if this is the competitions public list, parse and enqueue detail pages
        const isCompetitionsList =
            u.pathname === "/api/competitions/public/" ||
            u.pathname === "/api/competitions/public"; // both forms
    
        if (isCompetitionsList) {
            try {
            const txt = body.toString("utf-8");
            const json = JSON.parse(txt);
            enqueueCompetitionDetailUrlsFromJson(json);
            } catch {
            // ignore parse errors
            }
        }
        }
        return;
    }

    if (!isAllowed(url)) return; // same-origin assets only (unless sameOrigin=false)
    const req = response.request();
    const rt = req.resourceType(); // 'document', 'script', 'stylesheet', 'image', 'font', ...
    if (rt === "document") return;

    const status = response.status();
    if (status < 200 || status >= 300) return;

    // Only keep “static-ish” resources
    const ct = (response.headers()["content-type"] || "").toLowerCase();
    const ok =
      rt === "stylesheet" ||
      rt === "script" ||
      rt === "image" ||
      rt === "font" ||
      rt === "media" ||
      ct.includes("text/css") ||
      ct.includes("javascript") ||
      ct.includes("image/") ||
      ct.includes("font/") ||
      ct.includes("application/font") ||
      ct.includes("application/octet-stream");

    if (!ok) return;

    const localRel = assetMap.get(url) || assetUrlToLocalPath(url);
    assetMap.set(url, localRel);

    if (downloadedAssets.has(url)) return;
    downloadedAssets.add(url);

    const localAbs = path.join(OUT_DIR, localRel);
    ensureDir(path.dirname(localAbs));

    const body = await response.body();
    fs.writeFileSync(localAbs, body);
  } catch (e) {
    // Keep going
  }
}

function looksLikeAsset(u) {
    // treat /static/* always as asset
    const p = u.pathname.toLowerCase();
    if (p.startsWith("/static/")) return true;
  
    // common asset extensions
    const ex = path.extname(p);
    return [
      ".css", ".js", ".mjs",
      ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico",
      ".woff", ".woff2", ".ttf", ".otf", ".eot",
      ".map", ".json",
      ".mp4", ".webm", ".mp3", ".wav"
    ].includes(ex);
}
  
function rewriteHtmlLinks(html, pageUrl, pageLocalRel) {
    const $ = cheerio.load(html);
    const baseUrl = new URL(pageUrl);
  
    // ---- Rewrite ONLY <a href> to local HTML pages ----
    $("a[href]").each((_, el) => {
      const v = $(el).attr("href");
      if (!v) return;
  
      const lower = v.trim().toLowerCase();
      if (
        lower.startsWith("mailto:") ||
        lower.startsWith("tel:") ||
        lower.startsWith("javascript:") ||
        lower.startsWith("data:") ||
        lower.startsWith("blob:")
      ) return;
  
      let abs;
      try { abs = new URL(v, baseUrl); } catch { return; }
      abs.hash = ""; // drop fragment for mapping
      const absStr = abs.toString();
  
      if (!isAllowed(absStr)) return;
  
      // If it *looks like an asset*, do NOT rewrite to .html
      if (looksLikeAsset(abs)) return;
  
      const targetLocalRel = pageUrlToLocalHtml(absStr);
      const rel = toRelative(pageLocalRel, targetLocalRel);
      const hashPart = v.includes("#") ? v.slice(v.indexOf("#")) : "";
      $(el).attr("href", rel + hashPart);
    });
  
    // ---- For non-<a> resources, rewrite to local asset if we have it, otherwise leave absolute (/static/...) ----
    const resourceAttrs = [
      ["link", "href"],
      ["script", "src"],
      ["img", "src"],
      ["source", "src"],
      ["video", "src"],
      ["audio", "src"],
      ["embed", "src"],
      ["iframe", "src"],
    ];
  
    function rewriteResource(el, attr) {
      const v = $(el).attr(attr);
      if (!v) return;
  
      const lower = v.trim().toLowerCase();
      if (lower.startsWith("data:") || lower.startsWith("blob:")) return;
  
      let abs;
      try { abs = new URL(v, baseUrl); } catch { return; }
      const absNorm = normalizeUrl(abs.toString());
      if (!absNorm) return;
  
      // Prefer keeping Django-style /static/... absolute
      if (abs.pathname.startsWith("/static/")) {
        $(el).attr(attr, abs.pathname + abs.search);
        return;
      }
  
      // If we downloaded it into assetMap, rewrite to relative local file
      if (assetMap.has(absNorm)) {
        $(el).attr(attr, toRelative(pageLocalRel, assetMap.get(absNorm)));
        return;
      }
  
      // Otherwise leave it as-is (or absolute)
      // $(el).attr(attr, abs.pathname + abs.search);  // optional
    }
  
    for (const [tag, attr] of resourceAttrs) {
      $(tag).each((_, el) => rewriteResource(el, attr));
    }
  
    return $.html();
}

// Clickable discovery + click attempt
async function exploreClicks(page) {
  // We only enqueue URLs when clicks lead to a *different URL*
  // (including SPA history changes).
  const clickables = await page.evaluate(() => {
    const els = Array.from(
      document.querySelectorAll(
        [
          "a[href]",
          "button",
          "input[type=button]",
          "input[type=submit]",
          "[role=button]",
          "[onclick]",
          "summary",
        ].join(",")
      )
    );

    // Return lightweight selectors for uniqueness
    function cssPath(el) {
      if (!(el instanceof Element)) return "";
      const parts = [];
      while (el && parts.length < 6) {
        let part = el.tagName.toLowerCase();
        if (el.id) {
          part += "#" + CSS.escape(el.id);
          parts.unshift(part);
          break;
        } else {
          // nth-of-type for stability
          const parent = el.parentElement;
          if (!parent) break;
          const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
          if (siblings.length > 1) {
            const idx = siblings.indexOf(el) + 1;
            part += `:nth-of-type(${idx})`;
          }
          parts.unshift(part);
          el = parent;
        }
      }
      return parts.join(" > ");
    }

    const out = [];
    const seen = new Set();
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      // Only visible-ish and not tiny
      if (rect.width < 2 || rect.height < 2) continue;
      const sel = cssPath(el);
      if (!sel || seen.has(sel)) continue;
      seen.add(sel);
      out.push(sel);
    }
    return out;
  });

  const limited = clickables.slice(0, MAX_CLICKS_PER_PAGE);
  for (const sel of limited) {
    const before = page.url();
    try {
      const loc = page.locator(sel).first();

      // Some clickables are covered; trial click helps avoid hard fails
      await loc.click({ trial: true, timeout: 1500 }).catch(() => {});
      await loc.click({ timeout: 4000 }).catch(() => {});

      // Wait for either navigation, url change (SPA), or network settling
      // Don’t block forever.
      await Promise.race([
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 4000 }).catch(() => {}),
        page.waitForURL((u) => u.toString() !== before, { timeout: 4000 }).catch(() => {}),
        page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {}),
      ]);

      const after = page.url();
      if (after && after !== before) {
        enqueue(after, `click:${sel}`);
        // go back so we can keep exploring from current page
        // (best-effort; SPAs may not go back cleanly)
        await page.goBack({ waitUntil: "domcontentloaded", timeout: 4000 }).catch(() => {});
        await page.waitForTimeout(250);
      }
    } catch (e) {
      // keep crawling
    }
  }
}

async function getStableHtml(page, { tries = 8, delayMs = 350 } = {}) {
    let lastLen = -1;
  
    for (let i = 0; i < tries; i++) {
      try {
        // If a navigation is happening, this sometimes still works better than page.content()
        const html = await page.evaluate(() => document.documentElement.outerHTML);
  
        // simple stability heuristic: length stops changing
        const len = html?.length ?? 0;
        if (len > 200 && len === lastLen) return html;
  
        lastLen = len;
      } catch (e) {
        // ignore and retry
      }
      await page.waitForTimeout(delayMs);
    }
  
    // final attempt
    try {
      const html = await page.evaluate(() => document.documentElement.outerHTML);
      if (html && html.length > 0) return html;
    } catch {}
  
    return "<!doctype html><html><head><meta charset='utf-8'></head><body><p>[Snapshot failed]</p></body></html>";
  }

function injectFetchShim(html) {
    // Inject into <head> if possible, otherwise prepend to <html>
    const shim = `
  <script>
  (() => {
    const ORIG_FETCH = window.fetch ? window.fetch.bind(window) : null;
    if (!ORIG_FETCH) return;
  
    // Minimal SHA1 for query hashing (matches Node crypto sha1 hex)
    // Source: compact JS SHA1 implementation (public domain-like patterns)
    function sha1(msg) {
      function rotl(n,s){return (n<<s)|(n>>> (32-s));}
      function tohex(i){for(var h="", s=28; s>=0; s-=4) h += ((i>>>s)&0xF).toString(16); return h;}
      var H0=0x67452301,H1=0xEFCDAB89,H2=0x98BADCFE,H3=0x10325476,H4=0xC3D2E1F0;
  
      // utf-8 encode
      msg = unescape(encodeURIComponent(msg));
      var ml = msg.length;
      var wa = [];
      for (var i=0; i<ml-3; i+=4) {
        wa.push((msg.charCodeAt(i)<<24) | (msg.charCodeAt(i+1)<<16) | (msg.charCodeAt(i+2)<<8) | (msg.charCodeAt(i+3)));
      }
      var rem = ml % 4;
      var last = 0;
      if (rem === 0) last = 0x080000000;
      else if (rem === 1) last = (msg.charCodeAt(ml-1)<<24) | 0x0800000;
      else if (rem === 2) last = (msg.charCodeAt(ml-2)<<24) | (msg.charCodeAt(ml-1)<<16) | 0x08000;
      else if (rem === 3) last = (msg.charCodeAt(ml-3)<<24) | (msg.charCodeAt(ml-2)<<16) | (msg.charCodeAt(ml-1)<<8) | 0x80;
      wa.push(last);
      while ((wa.length % 16) !== 14) wa.push(0);
      wa.push(ml >>> 29);
      wa.push((ml << 3) & 0x0ffffffff);
  
      for (var bo=0; bo<wa.length; bo+=16) {
        var W = wa.slice(bo, bo+16);
        for (var t=16; t<80; t++) W[t] = rotl(W[t-3]^W[t-8]^W[t-14]^W[t-16], 1);
  
        var a=H0,b=H1,c=H2,d=H3,e=H4;
        for (var t=0; t<80; t++) {
          var f,k;
          if (t<20) {f=(b&c)|((~b)&d); k=0x5A827999;}
          else if (t<40) {f=b^c^d; k=0x6ED9EBA1;}
          else if (t<60) {f=(b&c)|(b&d)|(c&d); k=0x8F1BBCDC;}
          else {f=b^c^d; k=0xCA62C1D6;}
          var temp = (rotl(a,5) + f + e + k + (W[t]>>>0))>>>0;
          e=d; d=c; c=rotl(b,30)>>>0; b=a; a=temp;
        }
        H0=(H0+a)>>>0; H1=(H1+b)>>>0; H2=(H2+c)>>>0; H3=(H3+d)>>>0; H4=(H4+e)>>>0;
      }
      return tohex(H0)+tohex(H1)+tohex(H2)+tohex(H3)+tohex(H4);
    }
  
    function mapApiToLocal(urlStr) {
      // Only remap same-origin absolute-path /api/... calls.
      // Keep query; we hash it the same way as the crawler.
      try {
        const u = new URL(urlStr, window.location.origin);
        if (u.origin !== window.location.origin) return null;
        if (!u.pathname.startsWith("/api/")) return null;
  
        const q = u.search ? "__q_" + sha1(u.search) : "";
        // Mirror location produced by crawler:
        // out/__api__/<pathname-without-leading-slash>/index__q_<hash>.json
        // Note: pathname includes "/api/..."
        const local = "/__api__" + u.pathname + "/index" + q + ".json";
        return local;
      } catch (e) {
        return null;
      }
    }
  
    window.fetch = async (input, init) => {
      const urlStr = (typeof input === "string") ? input : (input && input.url);
      const mapped = urlStr ? mapApiToLocal(urlStr) : null;
  
      if (mapped) {
        // Return a Response that looks like a normal JSON fetch
        return ORIG_FETCH(mapped, { method: "GET" });
      }
      return ORIG_FETCH(input, init);
    };
  })();
  </script>
  `;
  
    if (html.includes("</head>")) {
      return html.replace("</head>", shim + "\n</head>");
    }
    return shim + "\n" + html;
  }

  function stripCspMeta(html) {
    const $ = cheerio.load(html);
  
    // Remove CSP meta tags that block inline scripts
    $('meta[http-equiv="Content-Security-Policy"]').remove();
    $('meta[http-equiv="content-security-policy"]').remove();
    $('meta[http-equiv="Content-security-policy"]').remove();
  
    // Sometimes CSP is stored in "content" without http-equiv variations; remove any meta that mentions it
    $('meta').each((_, el) => {
      const c = ($(el).attr("content") || "").toLowerCase();
      const h = ($(el).attr("http-equiv") || "").toLowerCase();
      if (h.includes("content-security-policy") || c.includes("content-security-policy")) {
        $(el).remove();
      }
    });
  
    return $.html();
  }
  
  function injectApiShim(html) {
    const shim = `
  <script id="__api_shim__">
  (() => {
    // Map /api/... -> /__api__/api/.../index__q_<sha1(search)>.json
    // Also supports XHR (axios) and fetch.
  
    function rotl(n,s){return (n<<s)|(n>>> (32-s));}
    function tohex(i){for(var h="", s=28; s>=0; s-=4) h += ((i>>>s)&0xF).toString(16); return h;}
    function sha1(msg) {
      msg = unescape(encodeURIComponent(msg));
      var ml = msg.length, wa = [];
      for (var i=0; i<ml-3; i+=4) wa.push((msg.charCodeAt(i)<<24)|(msg.charCodeAt(i+1)<<16)|(msg.charCodeAt(i+2)<<8)|(msg.charCodeAt(i+3)));
      var rem = ml % 4, last = 0;
      if (rem===0) last = 0x080000000;
      else if (rem===1) last = (msg.charCodeAt(ml-1)<<24) | 0x0800000;
      else if (rem===2) last = (msg.charCodeAt(ml-2)<<24) | (msg.charCodeAt(ml-1)<<16) | 0x08000;
      else last = (msg.charCodeAt(ml-3)<<24) | (msg.charCodeAt(ml-2)<<16) | (msg.charCodeAt(ml-1)<<8) | 0x80;
      wa.push(last);
      while ((wa.length % 16) !== 14) wa.push(0);
      wa.push(ml >>> 29);
      wa.push((ml << 3) & 0x0ffffffff);
  
      var H0=0x67452301,H1=0xEFCDAB89,H2=0x98BADCFE,H3=0x10325476,H4=0xC3D2E1F0;
      for (var bo=0; bo<wa.length; bo+=16) {
        var W = wa.slice(bo, bo+16);
        for (var t=16; t<80; t++) W[t] = rotl(W[t-3]^W[t-8]^W[t-14]^W[t-16], 1)>>>0;
        var a=H0,b=H1,c=H2,d=H3,e=H4;
        for (var t=0; t<80; t++) {
          var f,k;
          if (t<20) {f=(b&c)|((~b)&d); k=0x5A827999;}
          else if (t<40) {f=b^c^d; k=0x6ED9EBA1;}
          else if (t<60) {f=(b&c)|(b&d)|(c&d); k=0x8F1BBCDC;}
          else {f=b^c^d; k=0xCA62C1D6;}
          var temp = (rotl(a,5) + f + e + k + (W[t]>>>0))>>>0;
          e=d; d=c; c=rotl(b,30)>>>0; b=a; a=temp;
        }
        H0=(H0+a)>>>0; H1=(H1+b)>>>0; H2=(H2+c)>>>0; H3=(H3+d)>>>0; H4=(H4+e)>>>0;
      }
      return tohex(H0)+tohex(H1)+tohex(H2)+tohex(H3)+tohex(H4);
    }
  
    function mapApi(urlStr) {
      try {
        const u = new URL(urlStr, window.location.origin);
        // Only same-origin, path starting with /api/
        if (u.origin !== window.location.origin) return null;
        if (!u.pathname.startsWith("/api/")) return null;
  
        const q = u.search ? "__q_" + sha1(u.search) : "";
        return "/__api__" + u.pathname + "/index" + q + ".json";
      } catch {
        return null;
      }
    }
  
    // ---- fetch() shim ----
    if (window.fetch) {
      const origFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const urlStr = (typeof input === "string") ? input : (input && input.url);
        const mapped = urlStr ? mapApi(urlStr) : null;
        if (mapped) return origFetch(mapped, { method: "GET" });
        return origFetch(input, init);
      };
    }
  
    // ---- XMLHttpRequest shim (axios uses this) ----
    const OrigXHR = window.XMLHttpRequest;
    if (OrigXHR) {
      function XHRProxy() {
        const xhr = new OrigXHR();
        const origOpen = xhr.open;
        xhr.open = function(method, url, ...rest) {
          const mapped = url ? mapApi(url) : null;
          if (mapped) {
            // Always GET mirrored JSON
            return origOpen.call(this, "GET", mapped, ...rest);
          }
          return origOpen.call(this, method, url, ...rest);
        };
        return xhr;
      }
      window.XMLHttpRequest = XHRProxy;
    }
  })();
  </script>
  `;
  
    const $ = cheerio.load(html);
  
    // Ensure <head> exists
    if ($("head").length === 0) {
      $("html").prepend("<head></head>");
    }
  
    // Put shim as the very first thing in <head>
    $("head").prepend(shim);
  
    return $.html();
  }

  function injectNavShim(html) {
    const shim = `
  <script id="__nav_shim__">
  (() => {
    // Maps an internal app route like /competitions/2 -> /pages/competitions/2.html
    function mapToLocalPagePath(pathname, search) {
      // Skip things that should remain as-is
      if (pathname.startsWith("/static/") || pathname.startsWith("/__api__/") || pathname.startsWith("/api/")) return null;
  
      // Mirror the crawler's pageUrlToLocalHtml convention (simplified):
      // - trailing slash => index.html
      // - otherwise => .html
      let p = pathname;
      if (p.endsWith("/")) p = p + "index";
      const ext = (p.match(/\\.[a-zA-Z0-9]+$/) || [null])[0];
      if (!ext) p = p + ".html";
  
      // We are serving from /pages/...
      return "/pages" + p;
    }
  
    // Intercept link clicks
    document.addEventListener("click", (e) => {
      const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
  
      const href = a.getAttribute("href");
      if (!href) return;
  
      // only same-origin-ish navigations
      if (href.startsWith("http://") || href.startsWith("https://")) {
        try {
          const u = new URL(href);
          if (u.origin !== window.location.origin) return;
          const mapped = mapToLocalPagePath(u.pathname, u.search);
          if (!mapped) return;
          e.preventDefault();
          window.location.href = mapped + (u.search || "") + (u.hash || "");
        } catch { return; }
        return;
      }
  
      // relative/absolute-path navigations
      if (href.startsWith("/")) {
        const mapped = mapToLocalPagePath(href.split("#")[0], "");
        if (!mapped) return;
        e.preventDefault();
        const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
        window.location.href = mapped + hash;
      }
    }, true);
  
  })();
  </script>
  `;
  
    const $ = cheerio.load(html);
    if ($("head").length === 0) $("html").prepend("<head></head>");
    $("head").prepend(shim);
    return $.html();
  }
  
  async function savePageSnapshot(page, urlStr) {
    const localRel = pageUrlToLocalHtml(urlStr);
    const localAbs = path.join(OUT_DIR, localRel);
  
    let html = await getStableHtml(page);
  
    // 1) Remove CSP meta that blocks our inline shim
    html = stripCspMeta(html);
  
    // 2) Inject API shim early (patches fetch + XHR)
    html = injectApiShim(html);
    html = injectNavShim(html);
  
    // 3) Your existing link rewriting
    html = rewriteHtmlLinks(html, urlStr, localRel);
  
    await writeFileAtomic(localAbs, html);
    return localRel;
  }

async function crawl() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 800 },
  });

  // Capture and store asset responses
  context.on("response", (resp) => {
    handleAssetResponse(resp);
  });

  const page = await context.newPage();

  let count = 0;

  while (queue.length && count < MAX_PAGES) {
    const { url, from } = queue.shift();
    if (visitedPages.has(url)) continue;
    visitedPages.add(url);

    console.log(`[${count + 1}/${MAX_PAGES}] Visiting: ${url} (from: ${from})`);

    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        const finalUrl = normalizeUrl(page.url()) || url;
        
        // enqueue redirect target
        if (finalUrl !== url) enqueue(finalUrl, "redirect");
        
        // now work with finalUrl
        const links = await page.evaluate(() => Array.from(document.querySelectorAll("a[href]")).map(a => a.href).filter(Boolean));
        for (const l of links) enqueue(l, "link");
        
        await exploreClicks(page);
        await savePageSnapshot(page, finalUrl);

      count += 1;
    } catch (e) {
      console.warn(`  ⚠️ Error on ${url}: ${e?.message || e}`);
      // Still attempt to save whatever we have if possible
      try {
        await savePageSnapshot(page, url);
      } catch {}
    }
  }

  // Write a simple root index.html that points to the start URL’s local file
  try {
    const startLocal = pageUrlToLocalHtml(normalizeUrl(START_URL));
    const rootIndex = path.join(OUT_DIR, "index.html");
    const rel = toRelative("index.html", startLocal);

    const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Static Mirror</title></head>
<body>
  <p>Static mirror created by Playwright crawler.</p>
  <p><a href="${rel}">Open start page</a></p>
</body>
</html>`;
    fs.writeFileSync(rootIndex, html);
  } catch {}

  await browser.close();

  console.log(`\nDone.`);
  console.log(`Pages saved: ${visitedPages.size}`);
  console.log(`Assets saved: ${downloadedAssets.size}`);
  console.log(`Output folder: ${OUT_DIR}`);
}

crawl().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});