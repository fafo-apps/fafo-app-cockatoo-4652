import { getBaseUrl } from '@/app/utils/baseUrl';

async function getPost(slug: string) {
  const res = await fetch(`${getBaseUrl()}/api/posts/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

export default async function StoryDetail({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return <div className="text-zinc-600">Story not found.</div>;

  return (
    <article className="prose prose-zinc max-w-none">
      <h1 className="mb-2">{post.title}</h1>
      {post.location && <p className="text-zinc-600 -mt-3 mb-4">{post.location}</p>}
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt={post.title} className="rounded-xl w-full object-cover mb-6" />
      )}
      <div className="whitespace-pre-wrap leading-7 text-zinc-800">{post.content}</div>
    </article>
  );
}
