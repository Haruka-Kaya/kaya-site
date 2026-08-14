import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SecurityResearch from '../../src/components/SecurityResearch.astro';

describe('SecurityResearch', () => {
  it('renders the three focus areas', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SecurityResearch, {
      props: { hackerone: 'https://hackerone.com/haruka-kaya' },
    });

    expect(html).toContain('Android');
    expect(html).toContain('Web &amp; API');
    expect(html).toContain('AI Agents');
  });

  it('renders the research steps in order', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SecurityResearch, {
      props: { hackerone: 'https://hackerone.com/haruka-kaya' },
    });

    const scopeIndex = html.indexOf('Scope');
    const reproduceIndex = html.indexOf('Reproduce');
    const reportIndex = html.indexOf('Report');
    expect(scopeIndex).toBeGreaterThan(-1);
    expect(reproduceIndex).toBeGreaterThan(scopeIndex);
    expect(reportIndex).toBeGreaterThan(reproduceIndex);
  });

  it('renders the HackerOne profile link only when provided', async () => {
    const container = await AstroContainer.create();
    const withLink = await container.renderToString(SecurityResearch, {
      props: { hackerone: 'https://hackerone.com/haruka-kaya' },
    });
    const withoutLink = await container.renderToString(SecurityResearch, {
      props: { hackerone: '' },
    });

    expect(withLink).toContain('href="https://hackerone.com/haruka-kaya"');
    expect(withoutLink).not.toContain('hackerone.com');
  });
});
