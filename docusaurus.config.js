// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Passkeys Glossary',
    tagline: 'This glossary aims to help understand passkeys and the underlying technologies with easy-to-follow examples and simple language.',
    favicon: 'img/passkeys.webp',

    // Set the production url of your site here
    url: 'https://passkeys-auth.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'corbado', // Usually your GitHub org/user name.
    projectName: 'passkeys-glossary', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/passkeys.webp',
            metadata: [{
                name: 'keywords',
                content: 'passkeys, passkey, passwordless, webauthn, fido2, authentication, CIAM, implementation, guides'
            }],
            navbar: {
                title: 'Passkeys Glossary',
                logo: {
                    alt: 'Passkeys Glossary',
                    src: 'img/passkeys.webp',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorialSidebar',
                        position: 'left',
                        label: 'Docs',
                    },
                    {href: 'https://passkeys.eu', label: 'Demo', position: 'left'},
                    {
                        href: 'https://github.com/corbado',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Intro',
                                to: '/docs/intro',
                            },
                            {
                                label: 'WebAuthn',
                                to: '/docs/category/webauthn',
                            },
                            {
                                label: 'Implementation',
                                to: '/docs/category/implementation',
                            },
                            {
                                label: 'Resources',
                                to: '/docs/category/resources',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Slack',
                                href: 'https://join.slack.com/t/corbado/shared_invite/zt-1b7867yz8-V~Xr~ngmSGbt7IA~g16ZsQ',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/corbado_tech',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/corbado',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Corbado GmbH.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
            colorMode: {
                disableSwitch: true
            },
            algolia: {
                // The application ID provided by Algolia
                appId: '8AAXAET7QX',

                // Public API key: it is safe to commit it
                apiKey: '94526eb3d16982747c37ff5079a123eb',

                indexName: 'passkeys-auth',

                // Optional: see doc section below
                contextualSearch: true,

                // Optional: Algolia search parameters
                searchParameters: {},

                // Optional: path for search page that enabled by default (`false` to disable it)
                searchPagePath: 'search',

                //..
            },
        }),
    scripts: [{
        src: '/js/matomo.js',
        async: true,
        defer: true
    }, {
        src: '/js/matomo-tag-manager.js',
        async: true,
        defer: true
    }]
};

module.exports = config;
