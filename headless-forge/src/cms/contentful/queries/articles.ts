import { contentfulClient } from '../client'
import { mapArticle } from '../mappers/article.mapper'
import type { Article } from '../../types/Article'

export async function getAllArticles(): Promise<Article[]> {
  const entries = await contentfulClient.getEntries({
    content_type: 'article',
    order: ['-fields.publishedAt'],
  })

  return entries.items.map(mapArticle)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const entries = await contentfulClient.getEntries({
    content_type: 'article',
    'fields.slug': slug,
    limit: 1,
  })

  if (entries.items.length === 0) return null

  return mapArticle(entries.items[0])
}