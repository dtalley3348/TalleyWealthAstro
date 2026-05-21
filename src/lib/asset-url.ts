export type AssetTransform = {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain';
  quality?: number;
};

export function assetUrl(
  ref: string | null | undefined,
  directusPublicUrl: string,
  transform?: AssetTransform,
): string | null {
  if (!ref) return null;
  const trimmed = String(ref).trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed;

  const base = `${directusPublicUrl.replace(/\/$/, '')}/assets/${trimmed}`;
  if (!transform) return base;

  const qp = new URLSearchParams();
  if (transform.width) qp.set('width', String(transform.width));
  if (transform.height) qp.set('height', String(transform.height));
  if (transform.fit) qp.set('fit', transform.fit);
  if (transform.quality) qp.set('quality', String(transform.quality));

  const qs = qp.toString();
  return qs ? `${base}?${qs}` : base;
}
