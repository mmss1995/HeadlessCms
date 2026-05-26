import type { Entry } from 'contentful'
import type { Article } from '../../types/Article'

export function mapArticle(entry: Entry<any>): Article {
  const fields = entry.fields

  return {
    slug:        fields.slug as string,
    title:       fields.title as string,
    excerpt:     fields.excerpt as string,
    body:        fields.body,
    publishedAt: fields.publishedAt as string,
    author:      fields.author as string,
    coverImage: {
      url: `https:${(fields.coverImage as any).fields.file.url}`,
      alt: (fields.coverImage as any).fields.title as string,
    },
  }
}