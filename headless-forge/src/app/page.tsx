import Link from 'next/link'
import { getAllArticles } from '@/cms/contentful/queries/articles'

export default async function HomePage() {
  const articles = await getAllArticles()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="flex flex-col gap-8">
        {articles.map((article) => (
          <article key={article.slug} className="border-b pb-8">
            <time className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <h2 className="text-2xl font-semibold mt-1 mb-2">
              <Link href={`/blog/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h2>
            <p className="text-gray-600">{article.excerpt}</p>
            <Link href={`/blog/${article.slug}`} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}