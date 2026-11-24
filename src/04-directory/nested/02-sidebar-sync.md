---
title: "嵌套子页 B：多级子目录与侧边栏同步机制"
eleventyNavigation:
  key: 02-sidebar-sync
  title: "嵌套子页 B：多级子目录与侧边栏同步机制"
  order: 2
---

# 嵌套子页 B：多级子目录与侧边栏同步机制

在纯 Markdown 母版仓库中，新增一篇子目录文档无需修改任何外部配置文件；派生到 Eleventy 后，得益于同级目录数据文件 `nested.11tydata.json` 预设了 `"eleventyNavigation": { "parent": "04-directory" }`，新建子页无需手改任何全局路由表，也无需重复指定父节点 `parent`，即可自动挂载到《04. 目录结构与路由取舍》子菜单下。

- [返回上一篇：《嵌套子页 A：排序前缀与 URL 纯净度权衡》](./01-order-and-url.md)
- [返回《04. 目录结构与路由取舍》](../index.md)
