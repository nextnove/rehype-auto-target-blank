# rehype-auto-target-blank

A [rehype](https://github.com/rehypejs/rehype) plugin to automatically detect external links and internal absolute paths, opening them in a new tab (`target="_blank"`).

[한국어 설명은 여기를 클릭하세요](./README.ko.md)

## ✨ Features

* **Smart Target Switching**: Automatically detects `http(s)://` links and automates new tab settings.
* **Precise Internal Link Control**: Register your own domains (`internalDomains`) to exclude `rel` attributes or toggle new tab behavior for specific internal absolute URLs.
* **Style & Accessibility**: Provides separate icon classes and automatic `aria-label` addition for screen readers.

---

## 📦 Installation

Open your terminal and run the following command in your project root.

```bash
# using npm
npm install rehype-auto-target-blank

# using pnpm
pnpm add rehype-auto-target-blank

# using yarn
yarn add rehype-auto-target-blank

```

---

## 🚀 Usage

### 1. Basic Usage (Zero Config)

Treats all `http(s)` links as external and opens them in a new tab.

```javascript
rehypePlugins: [rehypeAutoTargetBlank]

```

### 2. Full Configuration Example

Use this when you want full control over the plugin's behavior.

```javascript
rehypePlugins: [
  [
    rehypeAutoTargetBlank,
    {
      // 1. Register your domain
      internalDomains: ['my-site.com'],
      
      // 2. Open internal links in a new tab? (Default: true)
      // If set to false, '[https://my-site.com](https://my-site.com)' links will open in the same tab.
      addTargetToInternal: false,
      
      // 3. Custom Icon (Default: ' ↗', set to false to remove)
      icon: ' 🔗',
      
      // 4. Accessibility Label (Default: 'Opens in a new tab')
      ariaLabel: 'Opens in a new window',
      
      // 5. Custom Icon Properties
      iconProperties: {
        className: ['my-custom-icon'],
        'aria-hidden': 'true'
      }
    }
  ]
]

```

---

## 📊 Behavioral Differences

| Config State | Link Type | New Tab (`target`) | `rel` Attribute | Icon Property |
| --- | --- | --- | --- | --- |
| **Default** (No Config) | All `http(s)://` | ✅ | ✅ | `.external-link-icon` |
| **Domain Registered** | Your Domain | ✅ | **❌ (Clean)** | `data-rehype-icon="true"` |
| **Internal New Tab Off** | Your Domain | **❌ (Same Tab)** | ❌ | (No Icon) |

---

## ⚙️ Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `internalDomains` | `string[]` | `[]` | List of domains to be recognized as internal links. |
| `addTargetToInternal` | `boolean` | `true` | Whether to open internal domain links in a new tab. |
| `icon` | `string|object` | `' ↗'` | Icon appended to the link. Disabled if `false`. |
| `ariaLabel` | `string` | `'Opens in a new tab'` | `aria-label` text for screen readers. |
| `rel` | `string[]` | `['noopener', 'noreferrer']` | Security attributes added to external links. |

---

## 🎨 CSS Styling

```css
/* External link icon */
.external-link-icon { color: blue; }

/* Internal absolute link icon (when domain is registered) */
[data-rehype-icon="true"] { color: gray; }

```

---

## 🛠️ Framework Integration Guide

Here are examples for the most common environments: **Astro** and **Next.js**.

### 1. Using with Astro

Add the plugin to the `rehypePlugins` array in your `astro.config.mjs` file.

```javascript
import { defineConfig } from 'astro/config';
import rehypeAutoTargetBlank from 'rehype-auto-target-blank';

export default defineConfig({
  markdown: {
    rehypePlugins: [
      [
        rehypeAutoTargetBlank,
        {
          internalDomains: ['my-site.com'], // Register your domain
          // Additional options...
        }
      ]
    ],
  },
});

```

### 2. Using with Next.js (Contentlayer or Official Markdown)

Inject the plugin into your configuration file (e.g., `contentlayer.config.ts`).

```javascript
import rehypeAutoTargetBlank from 'rehype-auto-target-blank';

// Example for configuration with rehypePlugins
const options = {
  rehypePlugins: [
    [rehypeAutoTargetBlank, { internalDomains: ['my-blog.com'] }]
  ]
};

```

---

## 📄 License

[MIT](https://github.com/nextnove/rehype-auto-target-blank/blob/main/LICENSE) © [NextNove](https://github.com/nextnove/rehype-auto-target-blank)


