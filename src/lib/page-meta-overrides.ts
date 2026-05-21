interface BaseMeta {
  title: string;
  description: string;
  ogImage: string | null;
}

export async function loadPageMetaOverrides(_site: string, _path: string): Promise<Record<string, unknown>> {
  return {};
}

export function applyMetaOverrides(meta: BaseMeta, _overrides: Record<string, unknown>) {
  return {
    ...meta,
    metaTitle: meta.title,
    metaDescription: meta.description,
  };
}
