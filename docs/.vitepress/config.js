export default {
    title: "Forest's Blog",
    description: 'Just playing around.',
    themeConfig: {
        nav: [
            { text: 'Guide', link: '/guide', activeMatch: '/guide/' },
            {
                text: 'Dropdown Menu',
                items: [
                    { text: 'Item A', link: '/item-1' },
                    { text: 'Item B', link: '/item-2' },
                    { text: 'Item C', link: '/item-3' }
                ]
            }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/">蜀ICP备2023020990号-1</a> Copyright © 2019-present Forest'
        }
    },

}
