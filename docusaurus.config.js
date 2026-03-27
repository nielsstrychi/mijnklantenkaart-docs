// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'mijnklantenkaart-docs',
  tagline: 'Single Source of Truth',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://nielsstrychi.github.io',
  baseUrl: '/',

  organizationName: 'nielsstrychi',
  projectName: 'mijnklantenkaart-docs',

  onBrokenLinks: 'warn',

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
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'MijnKlantenkaart',
        logo: {
          alt: 'MijnKlantenkaart Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/business',
            position: 'left',
            label: 'Business',
          },
          {
            to: '/technical',
            position: 'left',
            label: 'Technical',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Repositories',
            items: [
              {
                label: 'Frontend',
                href: 'https://github.com/nielsstrychi/mijnklantenkaart-frontend',
              },
              {
                label: 'Backend',
                href: 'https://github.com/nielsstrychi/mijnklantenkaart-backend',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MijnKlantenkaart.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
