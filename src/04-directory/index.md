---
title: "04. 目录结构与路由取舍"
description: "实测 Eleventy v3 的 1:1 目录映射、*.11tydata.json 数据级联（Data Cascade）与内置离线 .md 链接自动重写插件。"
eleventyNavigation:
  key: 04-directory
  title: "04. 目录结构与路由取舍"
  order: 4
---

# 04. 目录结构与路由取舍（Data Cascade 数据级联模型）

将标准 GFM 母版 `docs/04-directory/` 迁移至 Eleventy `src/04-directory/` 时，展现了 11ty 在目录组织上极高的透明度与工程优雅度：

> [!TIP]
> **Eleventy 三大目录与路由王牌特性**
> 1. **保留标准 `index.md`（零改名负担）**：既不像 VuePress 强制改名 `README.md`，也不像 Hugo / Zola 那样因混淆 `index.md` 与 `_index.md` 导致子页面集体 404——`src/04-directory/index.md` 天然编译为 `/eleventy/04-directory/`。
> 2. **招牌 `*.11tydata.json` 数据级联（Data Cascade）**：本目录下放置了 `04-directory.11tydata.json`，子目录放置了 `nested/nested.11tydata.json`（自动为所有子页面批量注入 `"eleventyNavigation": { "parent": "04-directory" }`），页面顶部的紫色数据级联徽章即来自目录数据文件的自动向下合并！
> 3. **内置 `InputPathToUrlTransformPlugin` + `HtmlBasePlugin`**：文档内部**完全保留母版的离线 `.md` 相对链接**（如 `./nested/01-order-and-url.md`），在 VS Code / Obsidian / GitHub 中可直接点击跳转；而在构建时由 11ty v3 内置插件自动重写为带子路径前缀的线上路由 `/eleventy/04-directory/nested/01-order-and-url/`！

## Eleventy 目录体系优劣权衡

1. **`dir.input: "src"` 干净隔离**：工程根目录的 `README.md`、`package.json` 与 `eleventy.config.js` 天然被隔离在 `src/` 之外，无需手写排除规则。
2. **元数据按目录树自然继承**：通过 `src.11tydata.json` → `04-directory.11tydata.json` → `nested.11tydata.json` → 单文件 YAML Frontmatter 四级数据合并，彻底消除重复模板配置。
3. **代价：无开箱即用文档主题**：Eleventy 坚持“不预设任何前端 UI 框架”的微内核哲学，侧边栏递归宏（`@11ty/eleventy-navigation`）、TOC 提取与样式表均需团队自行编写 Nunjucks / WebC 模板。

## 嵌套子文档入口（源码保持纯正 `.md` 相对路径）

- [进入子文档 A：排序前缀与 URL 纯净度权衡](./nested/01-order-and-url.md)
- [进入子文档 B：多级子目录与侧边栏同步机制](./nested/02-sidebar-sync.md)
