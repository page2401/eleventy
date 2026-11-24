---
title: "嵌套子页 A：排序前缀与 URL 纯净度权衡"
eleventyNavigation:
  key: 01-order-and-url
  title: "嵌套子页 A：排序前缀与 URL 纯净度权衡"
  order: 1
---

# 嵌套子页 A：排序前缀与 URL 纯净度权衡

在母版目录 `docs/04-directory/nested/` 中，文件名使用 `01-order-and-url.md` 以保证在 Git 与代码编辑器中按阅读先后顺序排列。派生至 Eleventy v3 后，不仅可通过 `eleventyNavigation.order` 精确控制侧边栏次序，若希望抹除线上 URL 中的 `01-` 序号前缀，也只需在单页或目录级 `.11tydata.js` 中声明 `permalink` 计算属性，而不会破坏 `InputPathToUrlTransformPlugin` 对源文件路径 `./02-sidebar-sync.md` 的自动解析！

- [返回《04. 目录结构与路由取舍》](../index.md)
- [下一篇：《嵌套子页 B：多级子目录与侧边栏同步机制》](./02-sidebar-sync.md)
