const fs = require('fs')

try {
    fs.copyFileSync(process.cwd()+'/docs/mds/README.md', process.cwd()+'/README.md')
} catch (e) {
    console.log('复制文件失败', e.toString())
}