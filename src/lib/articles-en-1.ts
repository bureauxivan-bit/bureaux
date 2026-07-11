// English translations of SEO/AEO articles 1–4 from articles.ts.
// Slugs are localized for the /en version; `ukSlug` links back to the source article.
// Prices and figures mirror the Ukrainian originals — keep in sync.

import type { ArticleEn } from './articles-en';

export const ARTICLES_EN_1: ArticleEn[] = [
  {
    slug: 'interior-design-cost-kyiv-2026',
    ukSlug: 'skilky-koshtuye-dyzajn-interieru-kyiv-2026',
    title: 'How Much Does Interior Design Cost in Kyiv in 2026',
    description:
      'How much interior design costs for an apartment or house in Kyiv in 2026: price per m², what a design project includes, what drives the cost, and what turnkey realization costs. Real bureau X rates.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'The most common question at a first meeting is "how much will this cost". Here is the honest answer, no fine print: interior design in Kyiv in 2026 starts at $60 per square metre for a full design project. For a 200 m² house that means from $12,000. Now let’s break down exactly what you are paying for — and why one apartment can cost more than another of the same size.',
    blocks: [
      { type: 'h2', text: 'Design project price per square metre' },
      {
        type: 'p',
        html:
          'The logic is simple: the larger the space, the larger the project. That is why we price per square metre. Here are our rates for 2026:',
      },
      {
        type: 'table',
        head: ['Service', 'Price', 'What is included'],
        rows: [
          ['Interior design', 'from $60 / m²', 'Space planning, 3D visualizations, working drawings, specifications'],
          ['Architectural design', 'from $40 / m²', 'From concept sketch to building permit'],
          ['Author supervision', '$800 / month', 'On-site control of the build (Kyiv)'],
          ['Turnkey realization', 'from $1,400 / m²', 'Approximate budget for design + renovation with materials'],
        ],
      },
      {
        type: 'p',
        html:
          'One important detail: our minimum project is calculated as 120 m². Even if your apartment is 60 m², the amount of work is roughly the same as for 120 m² — so an interior design project starts at $7,200, and an architectural project at $4,800.',
      },

      { type: 'h2', text: 'Why two apartments of the same size cost differently' },
      {
        type: 'p',
        html: 'Equal square metres do not mean an equal price. Here is what moves the cost up or down:',
      },
      {
        type: 'ul',
        items: [
          'Floor area — the base value the project price is calculated from.',
          'Type of space — apartment, private house or commercial premises (restaurants, offices and shops have more complex logic).',
          'Layout complexity — replanning, merging rooms, unconventional geometry.',
          'Project depth — number of visualizations, level of detail in working drawings, custom furniture.',
          'Author supervision — a separate option if you want the studio to control the build on site.',
        ],
      },

      { type: 'h2', text: 'What a full design project includes' },
      {
        type: 'p',
        html:
          'A full design project is not just "pretty pictures" — it is a complete documentation package that lets builders reproduce the design exactly:',
      },
      {
        type: 'ul',
        items: [
          'Space planning — wall layout, furniture placement, zoning.',
          '3D visualizations — photorealistic images of the future interior.',
          'Working drawings — wall elevations, ceiling and floor plans, electrical and plumbing layouts.',
          'Specifications — a list of materials, furniture and equipment with sourcing links.',
        ],
      },

      { type: 'h2', text: 'What turnkey realization costs' },
      {
        type: 'p',
        html:
          'If you need not just a project but a finished result, the approximate budget for turnkey realization (design + renovation with materials) in Kyiv in 2026 is <strong>from $1,400 per m²</strong>. The final figure depends on the finish level, engineering systems and choice of materials. At bureau X, design and renovation can be handled by one team — with author supervision, so the result matches the project.',
      },

      { type: 'h2', text: 'Timelines' },
      {
        type: 'p',
        html:
          'A design project for a 60–100 m² apartment takes roughly 8–12 weeks. An architectural project for a house starts at 1 month. Exact timelines depend on the size and complexity of the property.',
      },

      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How much does interior design cost for a 60 m² apartment in Kyiv?',
            a: 'Since the minimum project is calculated as 120 m², a design project for a 60 m² apartment starts at $7,200. For apartments of 120 m² and above, the price is based on the actual area — from $60/m².',
          },
          {
            q: 'Is author supervision included in the project price?',
            a: 'No, author supervision is a separate service ($800/month in Kyiv). You need it if you want the studio to check on site that the renovation matches the project.',
          },
          {
            q: 'How much does a turnkey renovation cost together with design?',
            a: 'The approximate budget for turnkey realization (design + renovation with materials) is from $1,400/m². The final amount depends on the level of materials and engineering solutions.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/interior-design', label: 'Interior design — service and pricing' },
      { href: '/en/services/turnkey-renovation', label: 'Turnkey renovation and construction' },
      { href: '/en/projects', label: 'Completed bureau X projects' },
    ],
  },

  {
    slug: 'turnkey-renovation-stages',
    ukSlug: 'etapy-remontu-pid-klyuch',
    title: 'Turnkey Renovation Stages: From Brief to Finished Interior',
    description:
      'How a turnkey renovation of an apartment or house works: 6 stages from brief and design project to rough works, finishing, furnishing and author supervision. Explained through how bureau X works.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'What makes a turnkey renovation intimidating is the unknown: it is unclear what will happen and when. In reality, everything unfolds in six clear stages — from the first meeting to the moment you walk into a finished interior. Let’s go through each one, so you understand what the builders are being paid for and exactly where a result is easily lost.',
    blocks: [
      { type: 'h2', text: '1. Brief' },
      {
        type: 'p',
        html:
          'Everything starts with a conversation. We get to know each other, discuss the task, your habits and wishes — and yes, the budget, right away. It can be a site visit or a video call. The goal of this stage is not to "sell", but to understand what the end result should actually be.',
      },
      { type: 'h2', text: '2. Design project and specification' },
      {
        type: 'p',
        html:
          'Before anything is demolished or bought, the project comes first: space planning, visualizations, working drawings and a materials specification. This is the most important stage — every decision is made here. Changing a wall on paper costs nothing; rebuilding one that is already up costs a lot.',
      },
      { type: 'h2', text: '3. Rough works' },
      {
        type: 'p',
        html:
          'Screed, electrical wiring, plumbing, wall levelling. The things you never see behind the beautiful finishes — but they determine whether the interior lasts for years or starts cracking within a season. Never cut corners on rough works: they are the foundation of everything that follows.',
      },
      { type: 'h2', text: '4. Finishing works' },
      {
        type: 'p',
        html:
          'This is where the interior starts to look like the visualizations: floors, walls, doors, ceilings, details. The main rule is no deviations from the specification. If the project calls for a specific finish, that exact finish should go in — not "something similar, only cheaper".',
      },
      { type: 'h2', text: '5. Furnishing' },
      {
        type: 'p',
        html:
          'Furniture, lighting, textiles, handmade pieces — everything that turns a renovation into a living space. We select, order and deliver all of it ourselves, so you don’t spend months hunting for the right armchair across dozens of shops.',
      },
      { type: 'h2', text: '6. Author supervision' },
      {
        type: 'p',
        html:
          'Throughout the renovation, the studio monitors the work on site — so the result matches the project. This is the answer to the biggest renovation fear: "they drew one thing and built another". With supervision that doesn’t happen, because the people who drew the design are the ones responsible for it being followed.',
      },

      { type: 'h2', text: 'Why design and renovation are better in one set of hands' },
      {
        type: 'p',
        html:
          'The most expensive part of any renovation is rework. It happens where the designer drew one thing and the crew interpreted it their own way. When <a href="/en/services/turnkey-renovation">design and realization are handled by one team</a>, there is no "broken telephone": less rework, clear timelines and a single party responsible for the final result.',
      },

      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How many stages are there in a turnkey renovation?',
            a: 'Six: brief, design project and specification, rough works, finishing works, furnishing and author supervision. Supervision runs in parallel with the works and checks that the result matches the project.',
          },
          {
            q: 'Can a renovation start without a design project?',
            a: 'Technically yes, but that is exactly how the biggest rework and cost overruns happen. A project locks in all decisions before work begins — which is cheaper than redoing what has already been built.',
          },
          {
            q: 'Who is responsible if the result doesn’t match the design?',
            a: 'With author supervision — the studio. That is why we recommend keeping design and renovation in one set of hands: there is no situation where the designer and the builders shift the blame onto each other.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/turnkey-renovation', label: 'Turnkey renovation and construction' },
      { href: '/en/services/interior-design', label: 'Interior design — service and pricing' },
      { href: '/en/projects', label: 'Completed bureau X projects' },
    ],
  },

  {
    slug: 'how-to-choose-a-design-studio',
    ukSlug: 'yak-obraty-dyzajn-byuro',
    title: 'How to Choose a Design Studio: 7 Questions to Ask Before You Start',
    description:
      'How to choose a design studio for your apartment or house without regrets: seven questions about pricing, project scope, author supervision, timelines and responsibility to ask before signing a contract.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'Choosing a studio means choosing people you will live alongside quite closely for several months — sometimes a year. A beautiful portfolio is only half the story. The other half becomes clear before you start, if you ask the right questions. Here are seven worth raising at the first meeting.',
    blocks: [
      { type: 'h2', text: '1. How exactly is the price formed?' },
      {
        type: 'p',
        html:
          'Ask directly: what are you paying for — per square metre, per room, a fixed fee? A transparent studio will easily explain the logic and give you a ballpark figure. An evasive "it depends" with no numbers at all should raise a red flag.',
      },
      { type: 'h2', text: '2. What does the project include?' },
      {
        type: 'p',
        html:
          'A full <a href="/en/services/interior-design">design project</a> is not just 3D images — it also includes space planning, working drawings and a materials specification. Without drawings and specifications, a "project" becomes a pretty render that no renovation can actually be built from.',
      },
      { type: 'h2', text: '3. How many visualizations and revisions are included?' },
      {
        type: 'p',
        html:
          'Find out how many options you will see and how many revisions are included. Normally a studio allows a reasonable number of minor adjustments within the brief, and only a fundamental change of concept is billed separately — and that is agreed in advance, not after the fact.',
      },
      { type: 'h2', text: '4. Is author supervision available?' },
      {
        type: 'p',
        html:
          'Supervision means controlling the build on site so the renovation matches the project. Without it the risk is simple: they drew one thing and built another. Ask whether the studio offers supervision and exactly what it covers.',
      },
      { type: 'h2', text: '5. Who is responsible for the realization?' },
      {
        type: 'p',
        html:
          'Ideally, <a href="/en/services/turnkey-renovation">design and renovation are in one set of hands</a>. Then there is no blame-shifting between the designer and the crew, less rework and clear timelines. If a studio only produces drawings, ask which contractors it works with and who controls quality.',
      },
      { type: 'h2', text: '6. What are the timelines?' },
      {
        type: 'p',
        html:
          'A realistic studio will give you a ballpark and explain what it depends on. An apartment design project usually takes a few months; renovation takes longer. Promises of "turnkey in two weeks" are a reason for caution, not celebration.',
      },
      { type: 'h2', text: '7. Do they have their own style and completed projects?' },
      {
        type: 'p',
        html:
          'Look beyond the renders at <a href="/en/projects">completed projects</a> — photos of finished spaces, not just 3D. A recognizable signature and a portfolio of real work is what separates a studio with a voice from those who assemble interiors from other people’s pictures.',
      },

      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'What should I look for when choosing a design studio?',
            a: 'Transparent pricing, full project scope (space planning, drawings, specifications), the availability of author supervision, responsibility for realization, realistic timelines, and a portfolio of completed — not just visualized — projects.',
          },
          {
            q: 'How is a full design project different from a visualization?',
            a: 'A visualization is only a picture of the future interior. A full project adds planning solutions, working drawings and a materials specification that builders can use to reproduce the design exactly.',
          },
          {
            q: 'Why is author supervision needed?',
            a: 'So that the renovation result matches the project. Supervision means the studio controls the work on site; it removes the biggest renovation risk — when "they drew one thing and built another".',
          },
        ],
      },
    ],
    related: [
      { href: '/en/studio', label: 'About bureau X studio' },
      { href: '/en/services', label: 'All services and pricing' },
      { href: '/en/projects', label: 'Completed projects' },
    ],
  },

  {
    slug: 'apartment-renovation-cost-kyiv-2026',
    ukSlug: 'skilky-koshtuye-remont-kvartyry-pid-klyuch-kyiv-2026',
    title: 'How Much a Turnkey Apartment Renovation Costs in Kyiv in 2026',
    description:
      'How much a turnkey apartment renovation costs in Kyiv in 2026: approximate budget per m², what the price includes, what it depends on, and how "turnkey" differs from a regular renovation. bureau X rates.',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    lede:
      'A turnkey renovation in Kyiv in 2026 costs roughly from $1,400 per square metre — design, works and materials combined. For a 60 m² apartment that is approximately from $84,000; for 100 m² — from $140,000. The figure is sensitive to the level of materials and engineering, so let’s break down what it is made of.',
    blocks: [
      { type: 'h2', text: 'What the turnkey price includes' },
      {
        type: 'p',
        html:
          '"Turnkey" means you get a finished space you can move into — not a list of works. The price typically includes:',
      },
      {
        type: 'ul',
        items: [
          'Design project — space planning, visualizations, working drawings, specifications.',
          'Rough works — screed, electrical wiring, plumbing, levelling.',
          'Finishing works — floors, walls, ceilings, doors, finishes.',
          'Materials — from rough-stage supplies to final finishes.',
          'Furnishing — furniture, lighting, textiles (by agreement).',
          'Author supervision — control that the result matches the project.',
        ],
      },
      { type: 'h2', text: 'What the cost depends on' },
      {
        type: 'p',
        html:
          'Two apartments of the same size can differ in budget by a factor of two. The main factors:',
      },
      {
        type: 'ul',
        items: [
          'Level of materials — budget, mid-range or premium finishes and fixtures.',
          'Layout complexity — replanning, merging rooms, niches.',
          'Engineering — underfloor heating, air conditioning, smart home, ventilation.',
          'Furniture and furnishing — off-the-shelf or made to order.',
        ],
      },
      { type: 'h2', text: 'Turnkey renovation vs. a separate project and crew' },
      {
        type: 'p',
        html:
          'You can order just a <a href="/en/services/interior-design">design project</a> (from $60/m²) and look for a renovation crew separately. But then you personally coordinate the designer and the builders — and that is exactly the junction where rework happens. In the <a href="/en/services/turnkey-renovation">turnkey</a> format, design and realization are in one set of hands: less rework, clear timelines, one responsible party.',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How much does a turnkey apartment renovation cost in Kyiv in 2026?',
            a: 'The approximate budget for turnkey realization (design + renovation with materials) is from $1,400 per m². For a 60 m² apartment that is approximately from $84,000. The exact amount depends on the level of materials and engineering solutions.',
          },
          {
            q: 'Is furniture included in the turnkey renovation price?',
            a: 'Furnishing (furniture, lighting, textiles) can be included by agreement. We select, order and deliver everything ourselves as a separate stage.',
          },
          {
            q: 'How does a turnkey renovation differ from a regular one?',
            a: '"Turnkey" is a finished result — from the design project to furnishing — handled by one team, with author supervision. A regular renovation usually means the works only, while coordinating the design, materials and crew is on you.',
          },
        ],
      },
    ],
    related: [
      { href: '/en/services/turnkey-renovation', label: 'Turnkey renovation and construction' },
      { href: '/en/services/interior-design', label: 'Interior design — service and pricing' },
      { href: '/en/projects', label: 'Completed bureau X projects' },
    ],
  },
];
