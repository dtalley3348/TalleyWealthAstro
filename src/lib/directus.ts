export interface DirectusBlogPost {
  id: number;
  status: string;
  site: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  read_time: string;
  date_published: string;
  featured: boolean | null;
  duration: string | null;
  hero_image: string | null;
  hero_image_url?: string | null;
  video_url: string | null;
}

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || '';
const ADMIN_TOKEN = import.meta.env.DIRECTUS_ADMIN_TOKEN || '';

function headers() {
  return ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {};
}

export async function getBlogPosts(options: { siteKey?: string } = {}): Promise<DirectusBlogPost[]> {
  if (!DIRECTUS_URL || !ADMIN_TOKEN) return [];

  const params = new URLSearchParams({
    fields: 'id,status,site,title,slug,category,excerpt,body,author,read_time,date_published,featured,duration,hero_image,hero_image_url,video_url',
    sort: '-date_published',
    limit: '100',
  });
  params.set('filter[site][_eq]', options.siteKey ?? 'talley-wealth');
  params.set('filter[status][_eq]', 'published');

  try {
    const res = await fetch(`${DIRECTUS_URL.replace(/\/$/, '')}/items/blog_posts?${params}`, { headers: headers() });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string, siteKey = 'talley-wealth'): Promise<DirectusBlogPost | null> {
  if (!DIRECTUS_URL || !ADMIN_TOKEN) return null;

  const params = new URLSearchParams({
    fields: 'id,status,site,title,slug,category,excerpt,body,author,read_time,date_published,featured,duration,hero_image,hero_image_url,video_url',
    limit: '1',
  });
  params.set('filter[site][_eq]', siteKey);
  params.set('filter[slug][_eq]', slug);
  params.set('filter[status][_eq]', 'published');

  try {
    const res = await fetch(`${DIRECTUS_URL.replace(/\/$/, '')}/items/blog_posts?${params}`, { headers: headers() });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.[0] ?? null;
  } catch {
    return null;
  }
}
