const fs = require('fs');
const path = require('path');

function readDirectory(dir, showTree = false) {
    const result = { text: path.basename(dir).replace('.md', ''), items: [] };

    // 读取目录内容
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory() && showTree) {
            // 如果是目录，则递归地读取
            result.items.push(readDirectory(itemPath, item));
        } else {
            // console.log(itemPath.split('mds')[1].replace('.md', ''))
            // 如果是文件，只添加文件名
            result.items.push({ text: item.replace('.md', ''), link: path.join('/mds', itemPath.split('mds')[1].replace('.md', ''))});
        }
    }

    return result;
}

// 指定开始的目录
const directoryPath = path.join(__dirname, '../mds');

// 读取目录并创建树结构
const directoryTree = readDirectory(directoryPath, true);

module.exports = {
    nav: directoryTree.items,
}
