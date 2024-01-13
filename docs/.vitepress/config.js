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
        },
        sidebar: {
            // 当用户在 `指南` 目录页面下将会展示这个侧边栏
            '/README': [
                {
                    text: 'Guide',
                    items: [
                        // This shows `/guide/index.md` page.
                        { text: 'Index', link: '/guide/' }, // /guide/index.md
                        { text: 'One', link: '/guide/one' }, // /guide/one.md
                        { text: 'Two', link: '/guide/two' } // /guide/two.md
                    ]
                }
            ],

            // 当用户在 `配置` 目录页面下将会展示这个侧边栏
            '/config': [
                {
                    text: 'Config',
                    items: [
                        // This shows `/config/index.md` page.
                        { text: 'Index', link: '/config/' }, // /config/index.md
                        { text: 'Three', link: '/config/three' }, // /config/three.md
                        { text: 'Four', link: '/config/four' } // /config/four.md
                    ]
                }
            ]
        },
        search: {
            provider: 'local'
        }
    },

}
