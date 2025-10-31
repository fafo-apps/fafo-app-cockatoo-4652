import { getBaseUrl } from '@/app/utils/baseUrl';
import Link from 'next/link';

async function getPosts(q?: string) {
  const url = new URL(`${getBaseUrl()}/api/posts`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.data || [];
}

export default async function StoriesPage({ searchParams }: { searchParams: { q?: string } }) {
  const posts = await getPosts(searchParams.q);

  return (
    <div className="space-y-6">
      <form className="flex gap-2" action="/stories" method="get">
        <input name="q" defaultValue={searchParams.q || ''} placeholder="Search Oman stories..." className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <button className="rounded-lg bg-amber-600 text-white px-4 py-2 hover:bg-amber-700" type="submit">Search</button>
      </form>

      {posts.length === 0 ? (
        <p className="text-zinc-600">No stories yet. Try adding one!</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: any) => (
            <li key={post.slug} className="rounded-xl overflow-hidden border border-zinc-200 bg-white">
              {post.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_image_url} alt={post.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-amber-50" />
              )}
              <div className="p-4">
                <h3 className="font-medium text-lg"><Link className="hover:text-amber-700" href={`/stories/${post.slug}`}>{post.title}</Link></h3>
                <div className="text-sm text-zinc-600 flex gap-3">
                  {post.location && <span>{post.location}</span>}
                </div>
                {post.excerpt && <p className="text-zinc-700 mt-2 line-clamp-2">{post.excerpt}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
