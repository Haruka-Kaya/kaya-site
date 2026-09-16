import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import TechPage from '../../src/pages/tech/index.astro';
import EnTechPage from '../../src/pages/[lang]/tech/index.astro';
import TechArchive from '../../src/pages/tech/writeups/index.astro';
import WriteupPage, { getStaticPaths } from '../../src/pages/writeups/[slug].astro';
import { loadWriteups } from '../../src/lib/site';

describe('portfolio and technical surfaces', () => {
  it.each(['ja', 'en'] as const)('partitions all published %s articles without overlap', async lang => {
    const all = await loadWriteups(lang);
    const tech = await loadWriteups(lang, { surface: 'tech' });
    const notes = await loadWriteups(lang, { surface: 'portfolio' });
    expect(tech.length).toBeGreaterThan(0);
    expect(notes.length).toBeGreaterThan(0);
    expect(tech.every(p => p.data.category !== 'notes')).toBe(true);
    expect(notes.every(p => p.data.category === 'notes')).toBe(true);
    expect(new Set([...tech, ...notes].map(p => p.id)).size).toBe(all.length);
  });

  it.each(['ja', 'en'] as const)('renders the %s technical home with localized links', async lang => {
    const container = await AstroContainer.create();
    const prefix = lang === 'en' ? '/en' : '';
    const html = await container.renderToString(lang === 'ja' ? TechPage : EnTechPage, {
      params: lang === 'en' ? { lang } : {}, request: new Request(`https://harukakaya.dev${prefix}/tech`), partial: false,
    });
    expect(html).toContain('data-surface="tech"');
    expect(html).toContain('Security research.');
    expect(html).toContain('id="research"');
    expect(html).toContain('id="projects"');
    expect(html).toContain(`href="${prefix}/tech/writeups"`);
    expect(html).toContain(`rel="canonical" href="https://harukakaya.dev${prefix}/tech"`);
    expect(html).not.toContain('data-constellation');
    expect(html).not.toContain('forty-three-worktrees');
  });

  it('keeps technical articles out of the personal archive, and notes out of tech', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TechArchive, { request: new Request('https://harukakaya.dev/tech/writeups'), partial: false });
    expect(html).toContain('href="/writeups/android-exported-components"');
    expect(html).not.toContain('href="/writeups/forty-three-worktrees"');
    expect(html).toContain('href="/en/tech/writeups"');
  });

  it('retains existing article URLs while switching the layout and archive destination', async () => {
    const paths = await getStaticPaths();
    const container = await AstroContainer.create();
    for (const [slug, surface, archive] of [
      ['android-exported-components', 'tech', '/tech/writeups'],
      ['forty-three-worktrees', 'portfolio', '/writeups'],
    ]) {
      const target = paths.find(p => p.params.slug === slug)!;
      const html = await container.renderToString(WriteupPage, {
        params: target.params, props: target.props, request: new Request(`https://harukakaya.dev/writeups/${slug}`), partial: false,
      });
      expect(html).toContain(`data-surface="${surface}"`);
      expect(html).toContain(`href="${archive}"`);
      expect(html).toContain(`rel="canonical" href="https://harukakaya.dev/writeups/${slug}"`);
      expect(html).toContain('BlogPosting');
    }
  });
});
