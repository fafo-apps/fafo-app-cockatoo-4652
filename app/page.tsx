import Link from 'next/link';
import { getBaseUrl } from '@/app/utils/baseUrl';

async function getLatest() {
  const res = await fetch(`${getBaseUrl()}/api/posts?limit=3`, { next: { revalidate: 60 } });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const latest = await getLatest();

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-amber-100 to-rose-50 p-8 border border-amber-200">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Oman Travel Blog</h1>
        <p className="text-zinc-600 max-w-2xl">Share your stories from Muscat, deserts, wadis, forts, and coastline. Post photos, dates, and thoughts all in one place.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/stories/new" className="inline-flex items-center rounded-full bg-amber-600 text-white px-4 py-2 hover:bg-amber-700">Add a Story</Link>
          <Link href="/stories" className="inline-flex items-center rounded-full border border-amber-300 px-4 py-2 text-amber-800 hover:bg-amber-100">Browse Stories</Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Latest stories</h2>
        {latest.length === 0 ? (
          <p className="text-zinc-600">No stories yet. Start with your first post!</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latest.map((post: any) => (
              <li key={post.slug} className="rounded-xl overflow-hidden border border-zinc-200 bg-white">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt={post.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full bg-amber-50" />
                )}
                <div className="p-4">
                  <h3 className="font-medium"><Link className="hover:text-amber-700" href={`/stories/${post.slug}`}>{post.title}</Link></h3>
                  {post.location && <p className="text-sm text-zinc-600">{post.location}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
