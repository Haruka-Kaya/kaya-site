import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { createReader } from '@keystatic/core/reader';
import { describe, expect, it } from 'vitest';
import ProjectsPage from '../../src/pages/projects/index.astro';
import EnProjectsPage from '../../src/pages/[lang]/projects/index.astro';
import keystaticConfig from '../../keystatic.config';

describe('projects page', () => {
  it('lists every project ordered by the order field', async () => {
    const reader = createReader(process.cwd(), keystaticConfig);
    const all = await reader.collections.projects.all();
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectsPage, {
      request: new Request('https://harukakaya.dev/projects'),
      partial: false,
    });

    expect((html.match(/class="project-card/g) ?? []).length).toBe(all.length);
    const first = [...all].sort((a, b) => a.entry.order - b.entry.order)[0];
    const firstCard = html.indexOf('class="project-card');
    const secondCard = html.indexOf('class="project-card', firstCard + 1);
    expect(html.indexOf(first.entry.name)).toBeGreaterThan(firstCard);
    expect(html.indexOf(first.entry.name)).toBeLessThan(secondCard);
    expect(html).toContain(`${all.length} projects`);
  });

  it('renders the English projects page', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EnProjectsPage, {
      params: { lang: 'en' },
      request: new Request('https://harukakaya.dev/en/projects'),
      partial: false,
    });

    expect(html).toContain('<html lang="en"');
    expect(html).toContain('I build the tools I research with.');
    expect(html).toContain('hreflang="ja" href="https://harukakaya.dev/projects"');
  });
});
