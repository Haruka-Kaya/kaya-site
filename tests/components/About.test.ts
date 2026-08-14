import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import About from '../../src/components/About.astro';

describe('About', () => {
  it('renders the bio and location', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About, {
      props: { bio: 'ものづくりが好きです。', location: 'Tokyo, Japan' },
    });

    expect(html).toContain('ものづくりが好きです。');
    expect(html).toContain('Tokyo, Japan にいます');
  });

  it('omits the location line when location is empty', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About, {
      props: { bio: 'bio', location: '' },
    });

    expect(html).not.toContain('にいます');
  });
});
