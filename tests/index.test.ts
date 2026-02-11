import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
// import rehypeAutoTargetBlank from '../dist/index.js';
import rehypeAutoTargetBlank, { Options } from '../src/index';
async function process(markdown: string, options: Options = {}) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeAutoTargetBlank, options)
        .use(rehypeStringify)
        .process(markdown);
    return String(file);
}
describe('rehypeAutoTargetBlank', () => {
    it('adds target blank to external links', async () => {
        const html = await process('[Google](https://google.com)');
        expect(html).toContain('target="_blank"');
    });
    it('does NOT modify relative links', async () => {
        const html = await process('[Internal](/about)');
        expect(html).not.toContain('target="_blank"');
    });
    it('handles internalDomains correctly', async () => {
        const html = await process('[Internal](https://test.com/page)', { internalDomains: ['test.com'] });
        expect(html).toContain('target="_blank"');
    });
    it('adds rel to external links', async () => {
        const html = await process('[Google](https://google.com)');
        expect(html).toContain('rel="noopener noreferrer"');
    });
    it('does NOT add rel to internal links', async () => {
        const html = await process('[Internal](https://test.com/page)', { internalDomains: ['test.com'] });
        expect(html).not.toContain('rel=');
    });
    it('renders default icon on external links', async () => {
        const html = await process('[Google](https://google.com)');
        expect(html).toContain('external-link-icon');
    });
    it('does NOT render icon when icon=false', async () => {
        const html = await process('[Google](https://google.com)', { icon: false });
        expect(html).not.toContain('external-link-icon');
    });
    it('renders custom icon', async () => {
        const html = await process('[Google](https://google.com)', { icon: '🚀' });
        expect(html).toContain('🚀');
    });
    it('adds aria-label to external links', async () => {
        const html = await process('[Google](https://google.com)');
        expect(html).toContain('aria-label="Opens in a new tab"');
    });
    it('applies custom aria-label', async () => {
        const html = await process('[Google](https://google.com)', { ariaLabel: 'Se abre en la nueva tabla 😎' });
        expect(html).toContain('aria-label="Se abre en la nueva tabla 😎"');
    });
    it('does NOT add aria-label when disabled', async () => {
        const html = await process('[Google](https://google.com)', { ariaLabel: undefined });
        expect(html).not.toContain('aria-label=');
    });
    it('does NOT duplicate icon', async () => {
        const html = await process(`
[Google](https://google.com)
  `);
        const matches = html.match(/external-link-icon/g);
        expect(matches?.length).toBe(1);
    });
    it('applies custom aria-label', async () => {
        const html = await process('[Google](https://google.com)', { ariaLabel: 'Custom Label' });
        expect(html).toContain('aria-label="Custom Label"');
    });
});
