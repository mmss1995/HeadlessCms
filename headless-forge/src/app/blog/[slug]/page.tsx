import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getAllArticles, getArticleBySlug } from '@/cms/contentful/queries/articles'
import { notFound } from 'next/navigation'
import Image from 'next/image'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)

  if (!article) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <time className="text-sm text-gray-500">
        {new Date(article.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      <h1 className="text-4xl font-bold mt-2 mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-2">By {article.author}</p>
      <Image
        src={article.coverImage.url}
        alt={article.coverImage.alt}
        width={800}
        height={400}
        className="rounded-lg mb-8 w-full object-cover"
      />
      <div className="prose prose-lg max-w-none">
        {documentToReactComponents(article.body as any)}
      </div>
    </main>
  )
}