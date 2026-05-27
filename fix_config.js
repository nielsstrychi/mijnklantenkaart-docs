const fs = require('fs');

let config = fs.readFileSync('docusaurus.config.js', 'utf8');

config = config.replace(/tagline: 'Dinosaurs are cool'/, "tagline: 'Single Source of Truth'");
config = config.replace(/organizationName: 'facebook'/, "organizationName: 'nielsstrychi'");
config = config.replace(/projectName: 'docusaurus'/, "projectName: 'mijnklantenkaart-docs'");
config = config.replace(/https:\/\/github.com\/facebook\/docusaurus\/tree\/main\/packages\/create-docusaurus\/templates\/shared\//g, "https://github.com/nielsstrychi/mijnklantenkaart-docs/tree/main/");
config = config.replace(/title: 'My Site'/, "title: 'MijnKlantenkaart'");
config = config.replace(/alt: 'My Site Logo'/, "alt: 'MijnKlantenkaart Logo'");
config = config.replace(/href: 'https:\/\/github.com\/facebook\/docusaurus'/g, "href: 'https://github.com/nielsstrychi/mijnklantenkaart-docs'");
config = config.replace(/to: '\/docs\/intro'/g, "to: '/docs/business/intro'");
config = config.replace(/My Project, Inc\./, "MijnKlantenkaart.");

fs.writeFileSync('docusaurus.config.js', config);
