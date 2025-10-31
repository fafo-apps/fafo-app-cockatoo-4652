import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/utils/pool';

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, slug, excerpt, content, location, trip_date, cover_image_url, created_at
       FROM posts WHERE slug = $1 AND is_published = TRUE`,
      [params.slug]
    );
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: rows[0] });
  } catch (err: any) {
    console.error('GET /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json();
    const fields = ['title','excerpt','content','location','trip_date','cover_image_url','is_published'] as const;
    const setParts: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of fields) {
      if (key in body) {
        setParts.push(`${key} = $${idx}`);
        values.push(key === 'trip_date' && body[key] ? new Date(body[key]) : body[key]);
        idx++;
      }
    }

    if (setParts.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(params.slug);

    const { rows } = await pool.query(
      `UPDATE posts SET ${setParts.join(', ')}, updated_at = now() WHERE slug = $${idx} RETURNING id, title, slug, excerpt, content, location, trip_date, cover_image_url, is_published, created_at, updated_at`,
      values
    );

    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: rows[0] });
  } catch (err: any) {
    console.error('PATCH /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE slug = $1', [params.slug]);
    if (rowCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
