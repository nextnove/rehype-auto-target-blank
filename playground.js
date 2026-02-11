import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeAutoTargetBlank from './dist/index.js';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeAutoTargetBlank, { 
    internalDomains: ['test.com'], 
    // addTargetToInternal: false 
  })
  .use(rehypeStringify);

const markdown = `
[External](https://google.com)
[Internal Absolute](https://test.com/about)
[Internal Relative](/contact)
`;

processor.process(markdown).then((file) => {
  console.log(String(file));
});