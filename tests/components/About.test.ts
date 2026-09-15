import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import About from '../../src/components/About.astro';

describe('About', () => {
  it('splits the bio into paragraphs and renders highlights and the now block', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About, {
      props: {
        lang: 'ja',
        bio: '一段落目。\n\n二段落目。',
        now: 'いまの取り組み',
        location: '日本',
        highlights: [
          { label: '主な領域', value: 'Android' },
          { label: '資格', value: '無線' },
        ],
      },
    });

    expect(html).toContain('id="about"');
    expect(html).toMatch(/<p[^>]*>一段落目。<\/p>/);
    expect(html).toMatch(/<p[^>]*>二段落目。<\/p>/);
    expect(html).toContain('いまの取り組み');
    expect(html).toContain('主な領域');
    expect(html).toContain('Android');
    expect(html).toContain('日本');
  });

  it('omits location and now blocks when empty', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About, {
      props: { lang: 'en', bio: 'Bio', now: '', location: '', highlights: [] },
    });

    expect(html).not.toContain('about-location');
    expect(html).not.toContain('now-title');
    expect(html).toContain('An eye for building');
  });
});
