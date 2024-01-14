const {nav,} = require('./directoryTree')

module.exports = {
    title: "Forest's Blog",
    description: 'Just playing around.',
    themeConfig: {
        nav,
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/">蜀ICP备2023020990号-1</a> Copyright © 2019-present Forest'
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
