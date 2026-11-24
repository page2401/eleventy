---
title: "05. 高阶代码块与语法高亮"
description: "标准 GFM 母版派生：实测 @11ty/eleventy-plugin-syntaxhighlight (PrismJS 构建期 SSR) 独有的 0-indexed 斜杠行高亮 (ts/2,6-8 & json/2,6-8) 与 diff-ts 复合词法高亮。"
eleventyNavigation:
  key: "05-code-blocks"
  title: "05. 高阶代码块与语法高亮"
  order: 5
---

# 05. 高阶代码块与语法高亮（`@11ty/eleventy-plugin-syntaxhighlight` 基准）

技术文档中超过 40% 的篇幅由代码块构成，但标准 CommonMark / GitHub Flavored Markdown **仅定义了围栏语言标识（```` ```ts ````）**，并未定义文件名标题栏、指定行高亮、带语法着色的行级 Diff 以及多语言 Tab 代码组。本文件由原始 GFM 母版派生适配至 **Eleventy (`@11ty/eleventy@3.1.8`)**，页面全程保持 **0 个 `<script>` 标签（0 KB Client JS）**。

## 1. 代码块标题栏与斜杠行聚焦（```` ```ts/2,6-8 ```` · 注意 0-Indexed 陷阱！）

官方插件 `@11ty/eleventy-plugin-syntaxhighlight@5.0.2` 在 Node.js 构建期调用 **PrismJS** 直接输出纯静态 `.token` 标签。与社区常见的 `{3,7-9}` 花括号方言截然不同，11ty 采用 **`语言/行号` 斜杠后缀语法**，且行号**严格从 `0` 开始计数（0-indexed）**！例如下方代码用 ```` ```ts/2,6-8 ```` 精确将人类视角的第 `3` 行（索引 `2`）与第 `7–9` 行（索引 `6-8`）包裹为语义化的 `<mark class="highlight-line highlight-line-active">`：

**`scripts/resolve-route.ts`**

```ts/2,6-8
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
```

## 2. 配置文件关键行聚焦与双斜杠语义标记（`json/2,6-8`）

同样地，对母版 11 行 JSON 配置聚焦第 `3` 行与第 `7–9` 行时，必须将 1-based 行号减 1 改写为 ```` ```json/2,6-8 ````（此外，11ty 还支持双斜杠 `语言/新增行/删除行` 语法直接渲染 `<ins>` 与 `<del>` 行标签）：

```json/2,6-8
{
  "id": "ssg-benchmark",
  "routeStyle": "clean",
  "strictZeroCdn": true,
  "markdown": {
    "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
```

## 3. 保留 TypeScript 词法着色的复合 Diff（`diff-ts` 原生支持！）

这是 `@11ty/eleventy-plugin-syntaxhighlight` 相比传统 Pygments / Chroma / Giallo 的一大惊喜：插件内部预装了 `prismjs/plugins/diff-highlight/prism-diff-highlight`！只需将母版的 ` ```diff ` 改写为 **` ```diff-ts `**，即可在保留 `-` / `+` 增删整行背景的同时，**完整保留内部 `const`、`path.resolve`、模板字符串等 TypeScript 词法着色**：

```diff-ts
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（零客户端 JS 的纯 HTML Radio Tabs 与 `<details>`）

为贯彻 Eleventy 的 **Zero-Client-JS** 哲学，下方采用纯 HTML `<input type="radio">` + CSS 相邻兄弟选择器实现多运行时命令面板切换（内部 ` ```bash ` 块照常经过构建期 Prism 高亮，0 字节浏览器脚本）：

<div class="eleventy-code-tabs">
  <input type="radio" name="eleventy-runtime-tabs" id="eleventy-tab-node" checked />
  <label for="eleventy-tab-node">Node.js (<code>package.json</code> · 当前子站)</label>
  <input type="radio" name="eleventy-runtime-tabs" id="eleventy-tab-deno" />
  <label for="eleventy-tab-deno">Deno 2 (<code>deno.json</code>)</label>
  <input type="radio" name="eleventy-runtime-tabs" id="eleventy-tab-py" />
  <label for="eleventy-tab-py">Python (<code>requirements.txt</code>)</label>
  <input type="radio" name="eleventy-runtime-tabs" id="eleventy-tab-rb" />
  <label for="eleventy-tab-rb">Ruby (<code>Gemfile</code>)</label>

  <div class="eleventy-tab-panel">

```bash
npm ci && npm run build
```

  </div>
  <div class="eleventy-tab-panel">

```bash
deno task build
```

  </div>
  <div class="eleventy-tab-panel">

```bash
pip install -r requirements.txt && sphinx-build -b dirhtml . _build/dirhtml
```

  </div>
  <div class="eleventy-tab-panel">

```bash
bundle install && bundle exec jekyll build
```

  </div>
</div>

<details>
<summary>展开查看原生 <code>&lt;details&gt;</code> 折叠备选写法</summary>

```bash
npx @11ty/eleventy
```

</details>

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress、Starlight、Fumadocs、Nextra、Rspress、Nuxt、Quartz | ✅ 纯静态内联样式 | ✅ `{1,3-5}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | Docusaurus、VuePress、**Eleventy (plugin)**、Gatsby | ✅ 静态 Token 类名 | ✅ **11ty 专属 0-indexed `ts/2,6-8`** | ✅ **11ty 内置 `diff-ts` 复合词法高亮** |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、Zola (Rust Giallo)、mdBook (hljs) | ✅ (mdBook 为客户端 hljs) | ✅ Hugo/Zola 原生 `hl_lines` | ⚠️ 仅标准 `diff` 块红绿 |
