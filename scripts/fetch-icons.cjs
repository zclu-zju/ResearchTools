// fetch-icons.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const inputDir = path.resolve("public", "data");
const outputDir = path.resolve("public", "data-icons");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
}

function getBaseUrl(url) {
    try {
        const u = new URL(url);
        return `${u.protocol}//${u.hostname}`;
    } catch {
        return null;
    }
}

async function fetchIconFromHtml(url) {
    try {
        const resp = await axios.get(url, {timeout: 8000});
        const $ = cheerio.load(resp.data);

        const iconHref =
            $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href") ||
            $('link[rel="apple-touch-icon"]').attr("href");

        if (iconHref) {
            if (iconHref.startsWith("http")) return iconHref;
            const base = getBaseUrl(url);
            if (base) return new URL(iconHref, base).href;
        }

        const base = getBaseUrl(url);
        if (base) return `${base}/favicon.ico`;
    } catch (err) {
        const base = getBaseUrl(url);
        if (base) return `${base}/favicon.ico`;
    }
    return null;
}

async function main() {
    ensureDir(outputDir);
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith(".json"));
    console.log(files);
    console.log(`🕵️‍♂️ 正在处理 ${files.length} 个网站...`);

    let success = 0;
    for (const file of files) {
        const filePath = path.join(inputDir, file);
        const item = JSON.parse(fs.readFileSync(filePath, "utf8"));

        if (!item.url) {
            console.warn(`⚠️ 跳过: ${file}`);
            continue;
        }
        if (item.icon) {
            continue;
        }

        const iconUrl = await fetchIconFromHtml(item.url);
        if (iconUrl) {
            item.icon = iconUrl;
            success++;
            console.log(`✅ ${item.title} → ${iconUrl}`);
        } else {
            console.log(`❌ 未找到 favicon: ${item.url}`);
        }

        const outPath = path.join(outputDir, file);
        fs.writeFileSync(outPath, JSON.stringify(item, null, 2), "utf8");

        await new Promise(res => setTimeout(res, 200));
    }

    console.log(`🎉 完成！共成功添加 ${success} 个 icon。`);
}

main();
