# 📰 Headless Forge — Headless CMS + Next.js App Router

> A production-ready starter template for editorial websites with Next.js 14 App Router, Server Components, and a headless CMS — the AEM Headless pattern made open source.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Contentful](https://img.shields.io/badge/CMS-Contentful-2478CC?logo=contentful)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

---

## 🎯 Purpose

In enterprise projects with Adobe Experience Manager (AEM Headless), the pattern is always the same: the CMS exposes content via API, the frontend consumes it and renders it with full control over performance and UX.

**Headless Forge** replicates this pattern in an open source way: Next.js 14 as the presentation layer, Contentful as the headless CMS, with a project structure that scales from a personal blog to an enterprise editorial portal.

---

## 🏗️ Architecture

```
headless-forge/
├── app/                        # Next.js 14 App Router
│   ├── (site)/
│   │   ├── page.tsx            # Homepage — SSG
│   │   ├── blog/
│   │   │   ├── page.tsx        # Article list — ISR
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Single article — SSG with revalidation
│   │   └── layout.tsx
│   │
│   └── api/
│       └── revalidate/         # Webhook for on-demand ISR
│           └── route.ts
│
├── cms/                        # CMS abstraction layer
│   ├── contentful/
│   │   ├── client.ts           # Typed GraphQL client
│   │   ├── queries/            # GraphQL queries per content type
│   │   └── mappers/            # Contentful → domain type mapping
│   │
│   └── types/                  # CMS-agnostic domain types
│       ├── Article.ts
│       └── Author.ts
│
├── components/
│   ├── ui/                     # Base components (Button, Card, etc.)
│   └── content/                # Components tied to CMS content types
│
└── lib/
    ├── seo.ts                  # Dynamic metadata generation
    └── structured-data.ts      # JSON-LD for SEO
```

---

## ✨ Key Features

- **App Router + Server Components** — data fetching directly in server components, zero waterfall
- **Hybrid rendering** — SSG for articles, ISR for homepage, SSR for personalised content
- **CMS-agnostic layer** — the rest of the app never knows about Contentful: swapping the CMS only requires rewriting the mappers
- **On-demand ISR** — Contentful webhook → instant page revalidation without a full rebuild
- **End-to-end TypeScript** — types generated from the CMS GraphQL schema
- **SEO-optimised** — dynamic metadata, Open Graph, sitemap, JSON-LD

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/mmss1995/headless-forge.git
cd headless-forge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# → Fill in CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN

# Start the development server
npm run dev
```

---

## ⚙️ Pattern: CMS-Agnostic Layer

The key of the architecture is that components never talk directly to Contentful — they only use **domain types**.

```ts
// cms/types/Article.ts — domain type (CMS-agnostic)
export type Article = {
  slug:        string;
  title:       string;
  excerpt:     string;
  body:        string;
  author:      Author;
  publishedAt: Date;
  coverImage:  Image;
};

// cms/contentful/mappers/article.mapper.ts — translates Contentful → domain
export function mapArticle(raw: ContentfulArticle): Article {
  return {
    slug:        raw.fields.slug,
    title:       raw.fields.title,
    excerpt:     raw.fields.excerpt,
    body:        documentToHtmlString(raw.fields.body),
    author:      mapAuthor(raw.fields.author),
    publishedAt: new Date(raw.fields.publishedAt),
    coverImage:  mapImage(raw.fields.coverImage),
  };
}
```

Swapping CMS = rewriting only the mappers.

---

## 📡 On-Demand ISR

When an editor publishes an article on Contentful, a webhook triggers immediate revalidation:

```ts
// app/api/revalidate/route.ts
export async function POST(req: Request) {
  const body   = await req.json();
  const secret = req.headers.get('x-contentful-webhook-secret');

  if (secret !== process.env.WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const slug = body.fields?.slug?.['en-US'];
  await revalidatePath(`/blog/${slug}`);

  return new Response('Revalidated', { status: 200 });
}
```

---

## 🧰 Tech Stack

| Tool | Role |
|---|---|
| **Next.js 14** | Framework with App Router and Server Components |
| **Contentful** | Headless CMS (free tier available) |
| **TypeScript** | End-to-end typing |
| **Tailwind CSS** | Styling |
| **GraphQL** | CMS queries |
| **Vercel** | Deployment and edge caching |

---

## 👤 Author

**Matteo Sausto** — [github.com/mmss1995](https://github.com/mmss1995)

---

## 📄 License

MIT © [Matteo Sausto](https://github.com/mmss1995)
