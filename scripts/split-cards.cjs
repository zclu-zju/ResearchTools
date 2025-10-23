const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const inputFile = path.resolve("public", "data/merged.json");
const outputDir = path.resolve("public", "data_split");

function md5(text) {
    return crypto.createHash("md5").update(text).digest("hex");
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
}

function main() {
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ 未找到输入文件: ${inputFile}`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));
    const allItems = data.all || data; // 兼容直接为数组的情况
    ensureDir(outputDir);

    let success = 0;
    for (const item of allItems) {
        if (!item.url) {
            console.warn(`⚠️ 跳过：未包含 url 的项目: ${item.title}`);
            continue;
        }

        const fileName = md5(item.url) + ".json";
        const filePath = path.join(outputDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf8");
        success++;
    }

    console.log(`✅ 已成功拆分 ${success} 个 JSON 文件，输出目录: ${outputDir}`);
}

main();
