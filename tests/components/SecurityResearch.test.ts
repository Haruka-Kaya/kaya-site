import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SecurityResearch from '../../src/components/SecurityResearch.astro';

const baseProps = {
  lang: 'ja' as const,
  lead: 'リード文',
  focus: [
    { name: 'Android', detail: 'IPC' },
    { name: 'Web & API', detail: 'auth' },
    { name: 'AI Agents', detail: 'prompt injection' },
  ],
  steps: [
    { label: 'Scope', text: '読む' },
    { label: 'Reproduce', text: '再現する' },
    { label: 'Report', text: '伝える' },
  ],
  hackerone: 'https://hackerone.com/haruka-kaya',
};

describe('SecurityResearch', () => {
  it('renders focus areas, numbered steps, and the HackerOne link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SecurityResearch, { props: baseProps });

    expect(html).toContain('id="security"');
    expect(html).toContain('Android');
    expect(html).toContain('prompt injection');
    expect(html).toContain('03 areas');
    expect(html).toContain('Reproduce');
    expect(html).toContain(`href="${baseProps.hackerone}"`);
    expect(html).toContain('Responsible disclosure');
  });

  it('hides the HackerOne link when the URL is empty', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SecurityResearch, { props: { ...baseProps, lang: 'en', hackerone: '' } });

    expect(html).not.toContain('hackerone.com');
    expect(html).toContain('Find the boundary');
  });
});
