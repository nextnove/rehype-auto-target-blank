import { visit } from 'unist-util-visit';
import type { Element, ElementContent, Root } from 'hast';
import type { Transformer } from 'unified';

export interface Options {
  internalDomains?: string[];
  protocols?: string[];
  icon?: ElementContent | ElementContent[] | string | boolean;
  addTargetToInternal?: boolean;
  ariaLabel?: string;
  rel?: string[];
  iconProperties?: Record<string, any>;
}

const DEFAULT_OPTIONS: Required<Options> = {
  internalDomains: [],
  protocols: ['http', 'https'],
  icon: { type: 'text', value: '↗' },
  addTargetToInternal: true,
  ariaLabel: 'Opens in a new tab',
  rel: ['noopener', 'noreferrer'],
  iconProperties: {
    className: ['external-link-icon'],
    'aria-hidden': 'true',
  },
};

function isInternalLink(href: string, internalDomains: string[]): boolean {
  try {
    const url = new URL(href, 'http://internal.base');

    return internalDomains.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

function normalizeIcon(
  icon: Options['icon'],
): ElementContent | ElementContent[] | null {
  if (icon === false) return null;
  if (icon === undefined) return normalizeIcon(DEFAULT_OPTIONS.icon);

  if (typeof icon === 'string') {
    return { type: 'text', value: icon };
  }

  return icon as ElementContent | ElementContent[];
}

/**
 * Deep Clone
 */
function clone<T>(value: T): T {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

/**
 * Rehype plugin
 */
export default function rehypeAutoTargetBlank(
  options: Options = {},
): Transformer<Root, Root> {
  const settings = { ...DEFAULT_OPTIONS, ...options };

  const {
    internalDomains,
    protocols,
    addTargetToInternal,
    ariaLabel,
    rel: relList,
    iconProperties,
  } = settings;

  const icon = normalizeIcon(settings.icon);

  return function transformer(tree: Root) {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a' || typeof node.properties?.href !== 'string') {
        return;
      }

      const href = node.properties.href;

      const isHttpLink =
        protocols.some((p) => href.startsWith(`${p}://`)) ||
        href.startsWith('//');

      if (!isHttpLink) return;

      const isInternal = isInternalLink(href, internalDomains);

      const shouldBlank = !isInternal || addTargetToInternal;

      if (shouldBlank) {
        node.properties.target = '_blank';

        if (ariaLabel && !node.properties['aria-label']) {
          node.properties['aria-label'] = ariaLabel;
        }

        if (!isInternal) {
          const relValue = node.properties.rel;

          const relArray = Array.isArray(relValue)
            ? relValue.filter((v): v is string => typeof v === 'string')
            : typeof relValue === 'string'
              ? relValue.split(' ')
              : [];

          const currentRel = new Set<string>(relArray);

          relList.forEach((r) => currentRel.add(r));

          node.properties.rel = Array.from(currentRel);
        }
      }

      if (shouldBlank && icon) {
        const hasIcon = node.children?.some(
          (child) =>
            child.type === 'element' &&
            ((child.properties as any)?.className?.includes(
              'external-link-icon',
            ) ||
              (child.properties as any)?.['data-rehype-icon'] === 'true'),
        );

        if (!hasIcon) {
          const content = Array.isArray(icon) ? icon : [icon];
          const finalProperties = clone(iconProperties);

          if (isInternal) {
            delete finalProperties.className;
            finalProperties['data-rehype-icon'] = 'true';
          }

          node.children.push({
            type: 'element',
            tagName: 'span',
            properties: finalProperties,
            children: clone(content),
          });
        }
      }
    });
  };
}
