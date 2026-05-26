export type Article = {
  slug: string
  title: string
  excerpt: string
  body: unknown
  coverImage: {
    url: string
    alt: string
  }
  publishedAt: string
  author: string
}