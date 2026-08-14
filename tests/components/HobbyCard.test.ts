import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import HobbyCard from '../../src/components/HobbyCard.astro';

const baseProps = {
  name: 'FPVドローン',
  description: '空を飛ばして遊ぶ',
  icon: '🚁',
  slug: 'fpvdrone',
  index: 1,
};

describe('HobbyCard', () => {
  it('renders name, description, and icon', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HobbyCard, { props: baseProps });

    expect(html).toContain('FPVドローン');
    expect(html).toContain('空を飛ばして遊ぶ');
    expect(html).toContain('🚁');
  });

  it('links to the hobby detail page by slug', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HobbyCard, { props: baseProps });

    expect(html).toContain('href="/hobbies/fpvdrone"');
  });

  it('zero-pads the index number', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HobbyCard, {
      props: { ...baseProps, index: 7 },
    });

    expect(html).toContain('07');
  });
});
