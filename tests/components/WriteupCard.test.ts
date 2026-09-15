import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import WriteupCard from '../../src/components/WriteupCard.astro';

const baseProps = {
  lang: 'ja' as const,
  slug: 'how-i-write-hackerone-reports',
  title: '報告の書き方',
  summary: '要約',
  date: new Date('2026-08-24T00:00:00Z'),
  category: 'bugbounty',
  tags: ['HackerOne', 'Reporting', 'A', 'B'],
  readingMinutes: 5,
};

describe('WriteupCard', () => {
  it('renders title, summary, metadata, and a localized link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(WriteupCard, { props: baseProps });

    expect(html).toContain('報告の書き方');
    expect(html).toContain('要約');
    expect(html).toContain('bugbounty');
    expect(html).toContain('datetime="2026-08-24"');
    expect(html).toContain('約5分');
    expect(html).toContain('href="/writeups/how-i-write-hackerone-reports"');
    expect((html.match(/class="pill/g) ?? []).length).toBe(3);
  });

  it('marks featured cards and localizes reading time in English', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(WriteupCard, { props: { ...baseProps, lang: 'en', featured: true } });

    expect(html).toContain('writeup-card--featured');
    expect(html).toContain('5 min read');
    expect(html).toContain('href="/en/writeups/how-i-write-hackerone-reports"');
  });
});
