import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/utils/pool';

// Helper to build WHERE for search
function buildSearchClause(q?: string) {
  if (!q) return { clause: '', params: [] as any[] };
  const clause = `AND (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'') || ' ' || coalesce(location,'')) @@ plainto_tsquery('english', $3)
    OR title ILIKE '%' || $3 || '%'
    OR location ILIKE '%' || $3 || '%'
    OR content ILIKE '%' || $3 || '%'
  )`;
  return { clause, params: [q] };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const q = searchParams.get('q') || undefined;

    const { clause, params } = buildSearchClause(q);

    const values: any[] = [limit, offset, ...params];

    const sql = `
      SELECT id, title, slug, excerpt, location, trip_date, cover_image_url, created_at
      FROM posts
      WHERE is_published = TRUE
      ${clause}
      ORDER BY trip_date DESC NULLS LAST, created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(sql, values);
    return NextResponse.json({ data: rows });
  } catch (err: any) {
    console.error('GET /api/posts error', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let i = 1;
  while (true) {
    const { rows } = await pool.query('SELECT 1 FROM posts WHERE slug = $1', [candidate]);
    if (rows.length === 0) return candidate;
    i += 1;
    candidate = `${base}-${i}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      excerpt,
      location,
      trip_date,
      cover_image_url,
      slug,
      is_published = true,
    } = body || {};

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);
    finalSlug = await ensureUniqueSlug(finalSlug);

    const insertSql = `
      INSERT INTO posts (title, slug, excerpt, content, location, trip_date, cover_image_url, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, slug, excerpt, location, trip_date, cover_image_url, created_at
    `;
    const values = [
      title,
      finalSlug,
      excerpt || null,
      content,
      location || null,
      trip_date ? new Date(trip_date) : null,
      cover_image_url || null,
      !!is_published,
    ];

    const { rows } = await pool.query(insertSql, values);
    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/posts error', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
