const {nav,} = require('./directoryTree')

module.exports = {
    title: "Forest's Blog",
    description: '个人技术知识库，记录和分享个人碎片化、结构化、体系化的技术知识内容',
    themeConfig: {
        nav,
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/">蜀ICP备2023020990号-1</a> Copyright © 2019-present Forest 我的键修飞升指南'
        },
        sidebar: {
            // 当用户在 `mds` 目录页面下将会展示这个侧边栏
            '/mds': nav,
        },
        search: {
            provider: 'local'
        }
    },

}
