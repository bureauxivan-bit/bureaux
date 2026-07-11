// English translations of SEO/AEO articles (positions 5–9 of ARTICLES).
// Same rules as the Ukrainian source: indexable, in the sitemap, not linked
// from navigation. Prices mirror llms.txt / service pages — keep in sync.

import type { ArticleEn } from './articles-en';

export const ARTICLES_EN_2: ArticleEn[] = [
  {
    slug: 'house-design-cost',
    ukSlug: 'skilky-koshtuye-dyzajn-budynku',
    title: 'How Much House Design Costs for a 150–200 m² Home',
    description:
      'How much the design and planning of a private 150–200 m² house costs: architectural design and interior design prices per m², sample calculations, and what the work includes. Real rates from bureau X.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'A private house usually needs two things: an architectural design (from $40/m²) and an interior design (from $60/m²). For a 150–200 m² house that is roughly $6,000–8,000 for the architecture and $9,000–12,000 for the interior. Let us break down exactly what you are paying for.',
    blocks: [
      { type: 'h2', text: 'The two components of a house design price' },
      {
        type: 'p',
        html:
          'Designing the house itself and designing its interior are different jobs, and you can commission them together or separately:',
      },
      {
        type: 'table',
        head: ['Service', 'Price', '150 m² house', '200 m² house'],
        rows: [
          ['Architectural design', 'from $40 / m²', 'from $6,000', 'from $8,000'],
          ['Interior design', 'from $60 / m²', 'from $9,000', 'from $12,000'],
        ],
      },
      {
        type: 'p',
        html:
          'The <a href="/en/services/architecture">architectural design</a> covers everything from the first sketch to the building permit: siting on the plot, layouts, facades, structural concept. The <a href="/en/services/interior-design">interior design</a> shapes the house from the inside: room layouts, materials, lighting, furniture.',
      },
      { type: 'h2', text: 'What determines the cost' },
      {
        type: 'ul',
        items: [
          'Floor area and number of storeys.',
          'Architectural complexity — the terrain of the plot, the form of the house, panoramic glazing.',
          'Depth of the interior design — the number of visualizations, custom-made furniture.',
          'Whether you need author supervision during construction ($800/month).',
        ],
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How much does a design for a 200 m² house cost?',
            a: 'Architectural design for a 200 m² house starts from $8,000 (from $40/m²), and interior design from $12,000 (from $60/m²). The services can be commissioned together or separately.',
          },
          {
            q: 'Can I order only the architecture, without interior design?',
            a: 'Yes. Architectural design (from $40/m²) and interior design (from $60/m²) are separate services. Clients often start with the architecture and return to the interior once construction is underway.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/architecture', label: 'Architectural design' },
      { href: '/en/services/interior-design', label: 'Interior design — service and prices' },
      { href: '/en/projects', label: 'Completed projects by bureau X' },
    ],
  },

  {
    slug: 'one-room-apartment-design',
    ukSlug: 'dyzajn-odnokimnatnoyi-kvartyry',
    title: 'One-Room Apartment Design: Where to Start and What It Costs',
    description:
      'One-room apartment design: where to start, how to plan a small space, how much the project costs and why a small apartment is not always cheaper. Advice and real rates from bureau X.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'A one-room apartment does not mean less work — often it is the opposite: in a small space, every centimetre has to earn its keep. Here is where to start and what it costs, honestly — including the nuance of our minimum project size.',
    blocks: [
      { type: 'h2', text: 'Where to start' },
      {
        type: 'p',
        html:
          'Start not with choosing tiles but with the layout. First we work out how you live: whether you work from home, host guests, need a separate sleeping area. The floor plan is built around that — and only then come the style, materials and furniture.',
      },
      { type: 'h2', text: 'How much a one-room apartment project costs' },
      {
        type: 'p',
        html:
          'There is an important nuance here: we calculate a minimum project as 120 m². Even for a 35–45 m² apartment, the workload is roughly the same as for 120 m² — so an <a href="/en/services/interior-design">interior design project</a> starts from $7,200. The reason is simple: a small apartment needs just as many layouts, drawings and decisions as a large one — and sometimes more.',
      },
      { type: 'h2', text: 'How to make a small space comfortable' },
      {
        type: 'ul',
        items: [
          'Multifunctional zones — one spot serves several scenarios.',
          'Built-in furniture and storage systems instead of bulky wardrobes.',
          'Well-planned lighting — several scenes instead of a single ceiling light.',
          'A restrained palette that does not visually fragment the space.',
        ],
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How much does a one-room apartment design cost?',
            a: 'Since a minimum project is calculated as 120 m², an interior design project for a one-room apartment starts from $7,200, regardless of the smaller floor area.',
          },
          {
            q: 'Why does a small apartment cost as much as a larger one?',
            a: 'Because the volume of design work — layouts, drawings, specifications — barely depends on floor area. A 40 m² apartment often requires no fewer decisions than a 120 m² one.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/interior-design', label: 'Interior design — service and prices' },
      { href: '/en/services/private-spaces', label: 'Private spaces' },
      { href: '/en/projects', label: 'Completed projects by bureau X' },
    ],
  },

  {
    slug: 'what-is-author-supervision',
    ukSlug: 'shcho-take-avtorskyj-naglyad',
    title: 'What Author Supervision Is and Why You Need It',
    description:
      'Author supervision means the designer or studio controls the renovation on site so the result matches the project. What supervision includes, what it costs ($800/month) and why renovations often drift away from the design without it.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'Author supervision is on-site control of how your project is built: the studio makes sure the renovation follows the drawings exactly, with the materials and solutions specified in the project. At bureau X it is a separate service — $800 per month in Kyiv. Here is why it matters.',
    blocks: [
      { type: 'h2', text: 'What author supervision includes' },
      {
        type: 'ul',
        items: [
          'Regular site visits while the work is underway.',
          'Checking that the work matches the project and the specifications.',
          'Answering the crew’s questions and clarifying details on site.',
          'Controlling materials — so nothing gets swapped for something “similar, only cheaper”.',
        ],
      },
      { type: 'h2', text: 'Why it is needed' },
      {
        type: 'p',
        html:
          'The most common renovation fear sounds like this: “they drew one thing and built another”. It happens when builders interpret the project their own way or simplify the tricky parts. Supervision removes that risk: the person responsible for the result matching the design is the one who drew it, not the one who laid the tiles.',
      },
      { type: 'h2', text: 'Can you do without it' },
      {
        type: 'p',
        html:
          'Technically yes, but then quality control falls on you. Supervision matters most when the project is complex or when the designer and the crew are different people. In a <a href="/en/services/turnkey-renovation">turnkey renovation</a>, supervision comes by default, because the project and its execution are in the same hands.',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How much does author supervision cost?',
            a: 'At bureau X, author supervision costs $800 per month in Kyiv. For other cities and countries — on request.',
          },
          {
            q: 'Is supervision included in the price of the design project?',
            a: 'No, it is a separate service. The design project (from $60/m²) is the documentation, while supervision is the on-site control of how that documentation gets built during the renovation.',
          },
          {
            q: 'What does the designer actually do during author supervision?',
            a: 'They make regular site visits, check that the work matches the project and the specifications, answer the crew’s questions and make sure materials and solutions are not substituted with cheaper ones.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/turnkey-renovation', label: 'Turnkey renovation and construction' },
      { href: '/en/services/interior-design', label: 'Interior design — service and prices' },
      { href: '/en/projects', label: 'Completed projects by bureau X' },
    ],
  },

  {
    slug: 'what-is-included-in-a-design-project',
    ukSlug: 'shcho-vhodyt-u-dyzajn-proekt',
    title: 'What a Complete Interior Design Project Includes',
    description:
      'What a complete interior design project includes: the layout plan, 3D visualizations, working drawings and specifications. The difference between “pretty pictures” and a full project you can actually renovate from.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'A complete design project is not a set of pretty pictures — it is a package of documentation that lets builders reproduce the design exactly. It consists of four parts: the layout plan, visualizations, working drawings and specifications. Let us look at each one.',
    blocks: [
      { type: 'h2', text: '1. Layout plan' },
      {
        type: 'p',
        html:
          'The foundation of the whole project: the placement of walls, zoning, furniture arrangement. This is where it is decided whether the space will actually be comfortable to live in — not just look good in a picture.',
      },
      { type: 'h2', text: '2. 3D visualizations' },
      {
        type: 'p',
        html:
          'Photorealistic images of the future interior. They let you see the result before the renovation starts and approve materials, colours and lighting while everything is still easy to change.',
      },
      { type: 'h2', text: '3. Working drawings' },
      {
        type: 'p',
        html:
          'The technical part the crew builds from: wall elevations, ceiling and floor plans, electrical and plumbing layouts. Without drawings, a “project” is just a render — impossible to renovate from correctly.',
      },
      { type: 'h2', text: '4. Specifications' },
      {
        type: 'p',
        html:
          'A list of every material, piece of furniture and appliance, with links: exactly what to buy, how much and where. The specification turns a beautiful picture into a concrete budget.',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'What does an interior design project include?',
            a: 'A complete design project consists of the layout plan, 3D visualizations, working drawings (wall elevations, electrical, plumbing) and specifications of materials and furniture.',
          },
          {
            q: 'How is a visualization different from a full project?',
            a: 'A visualization is only an image of the future interior. A full project adds the layout plan, working drawings and specifications — the documents you can actually renovate from.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/interior-design', label: 'Interior design — service and prices' },
      { href: '/en/projects', label: 'Completed projects by bureau X' },
    ],
  },

  {
    slug: 'design-project-and-renovation-timeline',
    ukSlug: 'skilky-tryvaye-dyzajn-proekt-i-remont',
    title: 'How Long a Design Project and Renovation Take: Realistic Timelines',
    description:
      'How long a design project for an apartment or house takes and how long a turnkey renovation lasts: realistic timelines by stage, what they depend on, and why a “two weeks” promise is a red flag.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'A design project for a 60–100 m² apartment takes roughly 8–12 weeks; an architectural design for a house starts from a month. The renovation itself takes longer and depends on the scope. Here are the timelines stage by stage, so you can plan realistically.',
    blocks: [
      { type: 'h2', text: 'Design project timelines' },
      {
        type: 'p',
        html:
          'A project for a 60–100 m² apartment is roughly 8–12 weeks of work: layout planning, visualizations, working drawings and specifications. An architectural design for a house takes from 1 month, depending on the size and complexity.',
      },
      { type: 'h2', text: 'Why the project should not be rushed' },
      {
        type: 'p',
        html:
          'Every decision is made at the <a href="/en/services/interior-design">design stage</a>. A few weeks spent here save months of rework during the renovation. Changing the layout on paper is free; rebuilding a wall that has already gone up is expensive and slow.',
      },
      { type: 'h2', text: 'What the timelines depend on' },
      {
        type: 'ul',
        items: [
          'The size and complexity of the property.',
          'The number of visualizations and revisions.',
          'How quickly approvals come from your side.',
          'Whether the renovation runs in parallel under author supervision.',
        ],
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How long does an apartment design project take?',
            a: 'A design project for a 60–100 m² apartment takes roughly 8–12 weeks. The exact timeline depends on the size, complexity and how quickly approvals happen.',
          },
          {
            q: 'How long does an architectural design for a house take?',
            a: 'An architectural design for a house takes from 1 month. The timeline depends on the floor area, number of storeys and the complexity of the architecture.',
          },
          {
            q: 'Can a project be done in two weeks?',
            a: 'A proper, complete project with drawings and specifications cannot realistically be done in two weeks. Very tight promises usually mean part of the work — the working drawings, for example — will simply be skipped.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/interior-design', label: 'Interior design — service and prices' },
      { href: '/en/services/turnkey-renovation', label: 'Turnkey renovation and construction' },
      { href: '/en/projects', label: 'Completed projects by bureau X' },
    ],
  },
];
