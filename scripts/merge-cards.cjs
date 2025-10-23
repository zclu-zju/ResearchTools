// merge-jsons.js
const fs = require("fs");
const path = require("path");

const inputDir = path.resolve("public", "data");
const outputFile = path.resolve("src", "cards.json");

function readAllJsonFiles(dir) {
    const result = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            result.push(...readAllJsonFiles(filePath));
        } else if (file.endsWith(".json")) {
            try {
                const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
                result.push(json);
            } catch (err) {
                console.error(`❌ 解析失败: ${filePath}`, err.message);
            }
        }
    }

    return result;
}

function groupByCategory(items) {
    const grouped = {};
    for (const item of items) {
        const cat = item.category || "未分类";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
    }
    return grouped;
}

function main() {
    const allItems = readAllJsonFiles(inputDir);
    const grouped = groupByCategory(allItems);

    const merged = {
        total: allItems.length,
        categories: Object.keys(grouped),
        grouped,
        all: allItems,
    };

    fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2), "utf8");
    console.log(`✅ 合并完成，共 ${allItems.length} 条数据，输出文件: ${outputFile}`);
}

main();
