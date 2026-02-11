# rehype-auto-target-blank

[![npm version](https://img.shields.io/npm/v/rehype-auto-target-blank.svg?style=flat-square)](https://www.npmjs.com/package/rehype-auto-target-blank)
[![npm downloads](https://img.shields.io/npm/dm/rehype-auto-target-blank.svg?style=flat-square)](https://www.npmjs.com/package/rehype-auto-target-blank)
[![license](https://img.shields.io/github/license/nextnove/rehype-auto-target-blank.svg?style=flat-square)](https://github.com/nextnove/rehype-auto-target-blank/blob/main/LICENSE)

외부 링크와 내부 절대 경로 링크를 자동으로 감지하여 새 탭(`target="_blank"`)으로 열어주는 [rehype](https://github.com/rehypejs/rehype) 플러그인입니다.

## ✨ 주요 특징

* **스마트한 새 탭 전환**: `http(s)://`로 시작하는 링크를 감지하여 새 탭 설정을 자동화합니다.
* **정교한 내부 링크 제어**: 내 도메인(`internalDomains`)을 등록하여 `rel` 속성 제외 및 새 탭 여부를 직접 결정할 수 있습니다.
* **스타일 및 접근성**: 아이콘 클래스 분리 및 `aria-label` 자동 추가 기능을 제공합니다.

---

## 📦 설치 방법

터미널(Terminal)을 열고 프로젝트 루트 폴더에서 아래 명령어를 입력하세요.

```bash
# npm을 사용하는 경우
npm install rehype-auto-target-blank

# pnpm을 사용하는 경우
pnpm add rehype-auto-target-blank

# yarn을 사용하는 경우
yarn add rehype-auto-target-blank
```
---

## 🚀 사용 방법

### 1. 기본 사용 (Zero Config)

모든 `http(s)` 링크를 외부 링크로 간주하여 새 탭으로 엽니다.

```javascript
rehypePlugins: [rehypeAutoTargetBlank]

```

### 2. 전체 옵션 설정 예제

모든 제어권을 직접 설정하고 싶을 때 사용합니다.

```javascript
rehypePlugins: [
  [
    rehypeAutoTargetBlank,
    {
      // 1. 내 도메인 등록
      internalDomains: ['my-site.com'],
      
      // 2. 내 사이트 링크도 새 탭으로 열 것인가? (기본값: true)
      // false로 설정하면 'https://my-site.com' 링크는 현재 탭에서 열립니다.
      addTargetToInternal: false,
      
      // 3. 커스텀 아이콘 (기본값: ' ↗', false 설정 시 제거)
      icon: ' 🔗',
      
      // 4. 접근성 레이블 (기본값: 'Opens in a new tab')
      ariaLabel: '새 창에서 열림',
      
      // 5. 아이콘 속성 커스텀
      iconProperties: {
        className: ['my-custom-icon'],
        'aria-hidden': 'true'
      }
    }
  ]
]

```

---

## 📊 설정별 동작 차이

| 설정 상태 | 링크 유형 | 새 탭 (`target`) | `rel` 속성 | 아이콘 속성 |
| --- | --- | --- | --- | --- |
| **기본값** (No Config) | 모든 `http(s)://` | ✅ | ✅ | `.external-link-icon` |
| **도메인 등록** (`internalDomains`) | 내 도메인 주소 | ✅ | **❌ (Clean)** | `data-rehype-icon="true"` |
| **내부 새 탭 끄기** (`addTargetToInternal: false`) | 내 도메인 주소 | **❌ (현재 창)** | ❌ | (아이콘 미생성) |

---

## ⚙️ 옵션 상세 (Options)

| 옵션명 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `internalDomains` | `string[]` | `[]` | 내부 링크로 인식할 도메인 목록입니다. |
| `addTargetToInternal` | `boolean` | `true` | 내부 도메인 링크도 새 탭(`_blank`)으로 열지 결정합니다. |
| `icon` | `string|object` | `' ↗'` | 링크 뒤에 붙을 아이콘입니다. `false` 시 비활성화됩니다. |
| `ariaLabel` | `string` | `'Opens in a new tab'` | 스크린 리더용 `aria-label` 텍스트입니다. |
| `rel` | `string[]` | `['noopener', 'noreferrer']` | 외부 링크에 추가될 보안 속성입니다. |

---

## 🎨 CSS 스타일링

```css
/* 외부 링크 아이콘 */
.external-link-icon { color: blue; }

/* 내부 절대 경로 링크 아이콘 (도메인 등록 시) */
[data-rehype-icon="true"] { color: gray; }

```


## 🛠️ 환경별 설정 가이드

가장 많이 사용되는 **Astro**와 **Next.js** 환경을 기준으로 설명해 드립니다.

### 1. Astro에서 사용하기

`astro.config.mjs` 파일의 `rehypePlugins` 배열에 추가합니다.

```javascript
import { defineConfig } from 'astro/config';
import rehypeAutoTargetBlank from 'rehype-auto-target-blank';

export default defineConfig({
  markdown: {
    rehypePlugins: [
      [
        rehypeAutoTargetBlank,
        {
          internalDomains: ['my-site.com'], // 내 도메인 등록
          // 추가 옵션들...
        }
      ]
    ],
  },
});

```

### 2. Next.js (contentlayer 또는 공식 markdown)에서 사용하기

설정 파일(`contentlayer.config.ts` 등)에 플러그인을 주입합니다.

```javascript
import rehypeAutoTargetBlank from 'rehype-auto-target-blank';

// ... 설정 중 rehypePlugins 부분
const options = {
  rehypePlugins: [
    [rehypeAutoTargetBlank, { internalDomains: ['my-blog.com'] }]
  ]
};

```

---

## 📄 라이선스

[MIT](https://github.com/nextnove/rehype-auto-target-blan/blob/main/license) © [NextNove](https://github.com/nextnove/rehype-auto-target-blank)
