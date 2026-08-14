import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import ProjectCard from '../../src/components/ProjectCard.astro';

const baseProps = {
  name: 'zeroterm',
  description: 'A terminal project',
  url: 'https://github.com/Haruka-Kaya/zeroterm',
  tags: ['Rust', 'CLI'],
  number: 3,
};

describe('ProjectCard', () => {
  it('renders name, description, and zero-padded number', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: baseProps });

    expect(html).toContain('zeroterm');
    expect(html).toContain('A terminal project');
    expect(html).toContain('03');
  });

  it('links to the project URL in a new tab when url is set', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, { props: baseProps });

    expect(html).toContain(`href="${baseProps.url}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('GitHubで見る');
  });

  it('shows an internal-project label when url is empty', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, {
      props: { ...baseProps, url: '' },
    });

    expect(html).toContain('内部プロジェクト');
    expect(html).not.toContain('GitHubで見る');
  });

  it('renders at most three tags', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, {
      props: { ...baseProps, tags: ['a', 'b', 'c', 'd', 'e'] },
    });

    const pillCount = (html.match(/class="pill/g) ?? []).length;
    expect(pillCount).toBe(3);
    expect(html).not.toContain('>d<');
  });

  it('omits the tag list when there are no tags', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectCard, {
      props: { ...baseProps, tags: [] },
    });

    expect(html).not.toContain('project-tags');
  });
});
