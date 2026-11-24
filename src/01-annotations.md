---
title: "01. 专属标注与元数据"
description: "测试 Eleventy v3 的 YAML Frontmatter、Data Cascade 继承、Nunjucks 成对短代码与 @mdit/plugin-alert 原生 GFM Alerts。"
eleventyNavigation:
  key: 01-annotations
  title: "01. 专属标注与元数据"
  order: 1
---

# 01. 专属标注与元数据（Nunjucks Shortcode + GFM Alerts）

不同静态网站生成器对“提示框 / 标注（Callouts / Admonitions）”和页面元数据的语法约定存在显著分歧。本文件由标准 GFM 母版派生适配至 **Eleventy (`@11ty/eleventy@3.1.8`)**。

## 1. Frontmatter 元数据与 Data Cascade 机制

Eleventy 对 YAML Frontmatter 采取完全开放的无 Schema 约束策略，且凭借独树一帜的 **Data Cascade（数据级联）** 机制，全站布局模板已在根目录 `src/src.11tydata.json` 中统一声明为 `"layout": "layouts/base.njk"`，单篇文档无需重复书写 `layout` 字段：

- **当前页标题字段**：`title: "01. 专属标注与元数据"`
- **页面摘要字段**：`description: "..."`
- **导航树声明字段**：`eleventyNavigation: { key, title, order }`（供官方 `@11ty/eleventy-navigation` 插件构建多级侧边栏，子目录亦可通过 `*.11tydata.json` 批量注入 `parent`）

## 2. 标准提示语义块（Eleventy Nunjucks 成对短代码）

在开启 `markdownTemplateEngine: "njk"` 后，Eleventy 允许直接在 Markdown 中调用由 `eleventyConfig.addPairedShortcode("callout", ...)` 注册的 Nunjucks 成对短代码 `{% raw %}{% callout "type", "标题" %}...{% endcallout %}{% endraw %}`：

{% callout "info", "默认信息提示块" %}
静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支，互不污染提交历史。
{% endcallout %}

{% callout "tip", "性能优化建议（自定义标题语义）" %}
在 Eleventy 成对短代码中调用同一 `markdown-it` 实例渲染内部文本，即可让容器内部无缝支持行内代码、**加粗强调**与数学公式；同时构建产物为纯静态 `<aside>` 标签，无需任何客户端组件水合。
{% endcallout %}

{% callout "warning", "模板预处理器边界注意" %}
当启用 `markdownTemplateEngine: "njk"` 时，Nunjucks 会在 Markdown 解析前先行扫描全文。若要在正文中展示字面量 `{% raw %}{% callout %}{% endraw %}` 或双花括号语法，必须使用 `{% raw %}{% raw %}...{% endraw %}{% endraw %}` 包裹，否则会被预处理器提前求值！
{% endcallout %}

{% callout "danger", "不可逆分支覆盖警告" %}
自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！
{% endcallout %}

## 3. 可折叠详情容器（直通标准 HTML `<details>`）

在 `eleventy.config.js` 中为 `markdown-it` 开启 `html: true` 后，Eleventy 原生直通标准 CommonMark `<details>` 与 `<summary>` 折叠块，且内部的语法高亮代码块与构建期 KaTeX 公式均可正常编译：

<details>
<summary>点击展开查看 Eleventy 短代码与母版折叠容器源码结构</summary>

{% raw %}
```markdown
{% callout "tip", "性能优化建议" %}
Eleventy Nunjucks 成对短代码与纯正 GFM 引用警报并存对比。
{% endcallout %}
```
{% endraw %}

除了代码块，折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。

</details>

## 4. GitHub 风格引用警报（GFM Alerts）跨框架直通测试

以下三段**保持母版原文一字不改**！通过在 `eleventy.config.js` 中为 `markdown-it` 挂载轻量的 `@mdit/plugin-alert@2.2.0`，Eleventy 可在构建期将全部 5 类 GitHub Flavored Markdown 警报直接编译为语义化提示框：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本，用于检验各生成器对母版语法的零改造直通能力。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了母版文档的派生改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器（如 VuePress v1、Starlight 默认配置、Docsify v4 旧插件），上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。
