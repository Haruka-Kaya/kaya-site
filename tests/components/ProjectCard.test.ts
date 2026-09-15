import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import ProjectCard from '../../src/components/ProjectCard.astro';

const baseProps = {
  lang: 'ja' as const,
  name: 'zeroterm',
  description: 'A terminal project',
  url: 'https://github.com/Haruka-Kaya/zeroterm',
  tags: ['Rust', 'CLI'],
  number: 3,
  year: '2024',
};

describe('ProjectCard', () => {
  it('renders name, description, year, and zero-padded number', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: baseProps });

    expect(html).toContain('zeroterm');
    expect(html).toContain('A terminal project');
    expect(html).toContain('03');
    expect(html).toContain('2024');
  });

  it('links to the project URL in a new tab when url is set', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: baseProps });

    expect(html).toContain(`href="${baseProps.url}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('GitHubで見る');
  });

  it('shows a translated internal-project label when url is empty', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: { ...baseProps, lang: 'en', url: '' } });

    expect(html).toContain('Internal project');
    expect(html).not.toContain('View on GitHub');
  });

  it('renders at most three tags in compact mode and five otherwise', async () => {
    const container = await AstroContainer.create();
    const tags = ['a', 'b', 'c', 'd', 'e', 'f'];
    const compact = await container.renderToString(ProjectCard, { props: { ...baseProps, tags, compact: true } });
    const full = await container.renderToString(ProjectCard, { props: { ...baseProps, tags } });

    expect((compact.match(/class="pill/g) ?? []).length).toBe(3);
    expect((full.match(/class="pill/g) ?? []).length).toBe(5);
  });

  it('omits the tag list when there are no tags', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: { ...baseProps, tags: [] } });

    expect(html).not.toContain('project-tags');
  });
});
