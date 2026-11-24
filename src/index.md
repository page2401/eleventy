---
title: "00. 概览与版本档案 (Eleventy v3)"
description: "Node.js 零客户端 JS 纯粹派静态站点生成器 Eleventy (@11ty/eleventy 3.1.8 ESM) 基准实测子站。"
eleventyNavigation:
  key: index
  title: "00. 概览与版本档案"
  order: 0
---

# Eleventy / 11ty (`3.1.8` ESM) 基准实测子站

本子模块由主仓 `page2401.github.io/docs/` 标准 GFM 母版**最小化派生适配**而来，实测前端纯粹主义标杆生成器 **Eleventy (`@11ty/eleventy@3.1.8`)** 在原生 ESM 配置、**零客户端 JS 哲学（Zero-Client-JS）**、**Data Cascade 目录数据级联**以及 `HtmlBasePlugin` + `InputPathToUrlTransformPlugin` 双内置插件下的真实工程表现。

<div class="hero-grid">
  <div class="hero-card">
    <h3><a href="./01-annotations.md">01. 专属标注与元数据 →</a></h3>
    <p>实测 Nunjucks 成对短代码 <code>{% raw %}{% callout %}{% endraw %}</code> 与 <code>@mdit/plugin-alert</code> 原生直通 GFM 五类警报。</p>
  </div>
  <div class="hero-card">
    <h3><a href="./02-diagrams.md">02. 流程图与时序图 →</a></h3>
    <p>通过 <code>amendLibrary("md")</code> 接管围栏块，仅在含图表的页面按需挂载本地 <code>mermaid@12.3.0</code>。</p>
  </div>
  <div class="hero-card">
    <h3><a href="./03-math.md">03. 数学公式排版 →</a></h3>
    <p>基于 <code>@mdit/plugin-katex</code> 构建期服务端渲染纯静态 HTML，正文章节实现 <strong>0 个 script 标签</strong>。</p>
  </div>
  <div class="hero-card">
    <h3><a href="./04-directory/index.md">04. 目录结构与路由取舍 →</a></h3>
    <p>实测 11ty 招牌 <code>*.11tydata.json</code> 数据级联与离线 <code>.md</code> 相对链接自动重写。</p>
  </div>
</div>

## 精确锁定版本档案（`package.json`）

Eleventy v3 全面拥抱原生 ESM（`"type": "module"`）。本子站将语法高亮、数学公式与导航树全部下沉至 Node.js 构建期完成，所有非图表页面输出 **0 字节客户端 JS（0 个 `<script>` 标签）**；KaTeX 字体与 Mermaid 脚本通过 `addPassthroughCopy` 本地化拷贝至 `_site/assets/`，全站零外部 CDN 请求：

| 依赖包名称 | 精确锁定版本 | 在本子站中的职责与接入方式 |
| :--- | :--- | :--- |
| `@11ty/eleventy` | `3.1.8` | v3 原生 ESM 核心编译器（内置 `HtmlBasePlugin` 与 `InputPathToUrlTransformPlugin`） |
| `@11ty/eleventy-navigation` | `1.0.5` | 官方无绑定多级导航树插件（配合 `eleventyNavigation` 与目录数据级联生成侧边栏） |
| `@11ty/eleventy-plugin-syntaxhighlight` | `5.0.2` | 基于 PrismJS 的 100% 构建期代码语法高亮（零运行时脚本） |
| `markdown-it` | `15.0.3` | 底层可插拔 CommonMark 解析内核（通过 `setLibrary("md")` 与 `amendLibrary("md")` 定制） |
| `@mdit/plugin-alert` | `2.2.0` | 原生解析 GitHub Flavored Markdown `> [!NOTE]` 至 `> [!CAUTION]` 五类警报块 |
| `@mdit/plugin-katex` | `1.2.1` | 构建期调用 KaTeX 服务端输出数学公式 HTML + MathML，无需浏览器加载 `katex.min.js` |
| `katex` | `0.19.1` | 通过 `addPassthroughCopy` 提取 `katex.min.css` 与 `fonts/*` 本地静态托管 |
| `mermaid` | `12.3.0` | 仅当页面产物包含 `.mermaid` 容器时按需引入 `/eleventy/assets/mermaid.min.js` |

## 五大标准基准章节对照

| 章节路径 | 测试维度 | 相对母版 `docs/*.md` 的核心派生改造点 |
| :--- | :--- | :--- |
| [`01-annotations.md`](./01-annotations.md) | 专属标注与元数据 | 补充 `eleventyNavigation`；第 2 节演示 Nunjucks `{% raw %}{% callout %}{% endraw %}` 成对短代码，第 4 节靠 `@mdit/plugin-alert` 零改动直通 `> [!NOTE]` |
| [`02-diagrams.md`](./02-diagrams.md) | 流程图与时序图 | 正文三段 Mermaid 代码块一字不改；由 `amendLibrary("md")` 转换为 `.mermaid` 容器并触发按需脚本加载 |
| [`03-math.md`](./03-math.md) | 数学公式排版 | 正文公式与 `\$` 转义测试一字不改；由 `@mdit/plugin-katex` 构建期直出 HTML，零双反斜杠吞噬 |
| [`04-directory/`](./04-directory/index.md) | 目录结构与路由取舍 | 保留 `index.md` 与离线 `.md` 相对链接！新增 `04-directory.11tydata.json` 与 `nested.11tydata.json` 展示数据级联 |
