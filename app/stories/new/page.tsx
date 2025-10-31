"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewStoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: any = Object.fromEntries(formData.entries());
    if (payload.trip_date === '') delete payload.trip_date;
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      router.push(`/stories/${data.data.slug}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">New Oman Story</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" required className="w-full rounded-lg border border-zinc-300 px-3 py-2" placeholder="Sunrise at Wahiba Sands" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Custom Slug (optional)</label>
          <input name="slug" className="w-full rounded-lg border border-zinc-300 px-3 py-2" placeholder="sunrise-wahiba-sands" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input name="location" className="w-full rounded-lg border border-zinc-300 px-3 py-2" placeholder="Wahiba Sands, Oman" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trip Date</label>
          <input type="date" name="trip_date" className="w-full rounded-lg border border-zinc-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input name="cover_image_url" className="w-full rounded-lg border border-zinc-300 px-3 py-2" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Excerpt (optional)</label>
          <textarea name="excerpt" className="w-full rounded-lg border border-zinc-300 px-3 py-2" rows={2} placeholder="A breathtaking dawn over endless dunes..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Story</label>
          <textarea name="content" required className="w-full rounded-lg border border-zinc-300 px-3 py-2" rows={8} placeholder={"Write your experience. Tips: where you stayed, what you ate, how to get there, costs, and highlights."} />
        </div>
        <button disabled={loading} className="rounded-lg bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 disabled:opacity-50">
          {loading ? 'Posting...' : 'Publish Story'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
