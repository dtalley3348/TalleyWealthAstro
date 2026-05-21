import type { BlogPost } from '../../data/talley-wealth/site-content';

export type BlogContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export type BlogPostInput = BlogPost & {
  author?: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean | null;
  duration?: string | null;
  videoUrl?: string | null;
};

export type NormalizedBlogPost = BlogPostInput & {
  bodyBlocks: BlogContentBlock[];
  readTime: string;
  author: string;
  tags: string[];
  relatedPosts: BlogPost[];
};

export function normalizeBlogBody(body: string | string[] | BlogContentBlock[]): BlogContentBlock[] {
  if (!Array.isArray(body)) return parseTextBody(body);

  return body.flatMap((block) => {
    if (typeof block !== 'string') return block;
    return parseTextBody(block);
  });
}

export function normalizeBlogPost(post: BlogPostInput, allPosts: BlogPost[]): NormalizedBlogPost {
  const bodyBlocks = normalizeBlogBody(post.body);
  const readTime = post.readTime || estimateReadTime(bodyBlocks);
  const tags = post.tags?.length ? post.tags : deriveTags(post);

  return {
    ...post,
    bodyBlocks,
    readTime,
    author: post.author || 'David Talley',
    tags,
    relatedPosts: findRelatedPosts(post, allPosts, 3),
  };
}

export function estimateReadTime(blocks: BlogContentBlock[]): string {
  const words = blocks
    .flatMap((block) => block.type === 'list' ? block.items : [block.text])
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

export function deriveTags(post: Pick<BlogPost, 'category' | 'title' | 'description'>): string[] {
  const text = `${post.category} ${post.title} ${post.description}`.toLowerCase();
  const tags = new Set<string>([post.category]);

  if (text.includes('retirement') || text.includes('social security')) tags.add('Retirement Planning');
  if (text.includes('tax') || text.includes('roth')) tags.add('Tax Planning');
  if (text.includes('business')) tags.add('Business Owners');
  if (text.includes('investment') || text.includes('portfolio')) tags.add('Investment Management');
  if (text.includes('independence') || text.includes('wealth')) tags.add('Wealth Strategy');

  return Array.from(tags);
}

export function findRelatedPosts(post: BlogPostInput, allPosts: BlogPost[], max = 3): BlogPost[] {
  const tags = deriveTags(post).map((tag) => tag.toLowerCase());

  return allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const candidateText = `${candidate.category} ${candidate.title} ${candidate.description}`.toLowerCase();
      const score = tags.reduce((sum, tag) => sum + (candidateText.includes(tag.toLowerCase()) ? 1 : 0), 0)
        + (candidate.category === post.category ? 2 : 0);
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(({ candidate }) => candidate);
}

function parseTextBody(text: string): BlogContentBlock[] {
  const chunks = text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk) => {
    if (chunk.startsWith('### ')) return { type: 'heading', level: 3, text: chunk.replace(/^###\s+/, '') };
    if (chunk.startsWith('## ')) return { type: 'heading', level: 2, text: chunk.replace(/^##\s+/, '') };
    if (chunk.startsWith('> ')) return { type: 'quote', text: chunk.replace(/^>\s+/, '') };

    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length > 1 && lines.every((line) => /^[-*]\s+/.test(line))) {
      return { type: 'list', items: lines.map((line) => line.replace(/^[-*]\s+/, '')) };
    }

    return { type: 'paragraph', text: chunk };
  });
}

