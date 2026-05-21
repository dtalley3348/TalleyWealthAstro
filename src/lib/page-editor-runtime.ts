export interface EditorMode {
  active: boolean;
  site: string;
  path: string;
  overrides: Record<string, unknown>;
}

export async function resolveEditorMode(Astro: { url: URL }): Promise<EditorMode> {
  const path = Astro.url.pathname.replace(/^\/brands\/talley-wealth/, '') || '/';
  return {
    active: false,
    site: 'talley-wealth',
    path,
    overrides: {},
  };
}
