import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { createReader } from '@keystatic/core/reader';
import { describe, expect, it } from 'vitest';
import HobbyPage, { getStaticPaths } from '../../src/pages/hobbies/[slug].astro';
import keystaticConfig from '../../keystatic.config';

describe('hobby page', () => {
  it('getStaticPaths returns params for every hobby', async () => {
    const paths = await getStaticPaths();
    const reader = createReader(process.cwd(), keystaticConfig);
    const slugs = await reader.collections.hobbies.list();

    expect(paths.map((p) => p.params.slug).sort()).toEqual([...slugs].sort());
  });

  it('renders a hobby page with title, description, and back links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HobbyPage, {
      params: { slug: 'fpvdrone' },
      request: new Request('https://harukakaya.dev/hobbies/fpvdrone'),
      partial: false,
    });

    expect(html).toContain('<title>');
    expect(html).toContain('好きなこと');
    expect(html).toContain('href="/#likes"');
    expect(html).toContain('canonical');
  });
});
