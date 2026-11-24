import { HtmlBasePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import MarkdownIt from "markdown-it";
import { alert } from "@mdit/plugin-alert";
import { katex } from "@mdit/plugin-katex";

const CALLOUT_DEFAULTS = {
  info: "信息说明",
  note: "提示",
  tip: "性能优化与技巧",
  important: "重要约定",
  warning: "注意",
  caution: "危险警告",
  danger: "危险警告"
};

function slugifyHeading(raw) {
  const plain = raw
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-zA-Z0-9#]+;/g, "")
    .trim()
    .toLowerCase();
  return (
    plain
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export default function (eleventyConfig) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
  })
    .use(alert, { deep: false })
    .use(katex, { throwOnError: false });

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.amendLibrary("md", (mdLib) => {
    const defaultFence = mdLib.renderer.rules.fence.bind(mdLib.renderer.rules);
    mdLib.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (token.info.trim() === "mermaid") {
        const escaped = mdLib.utils.escapeHtml(token.content.trim());
        return `<div class="eleventy-mermaid-wrap"><pre class="mermaid">${escaped}</pre></div>\n`;
      }
      return defaultFence(tokens, idx, options, env, self);
    };

    const defaultHeadingOpen =
      mdLib.renderer.rules.heading_open ||
      ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

    mdLib.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const inlineToken = tokens[idx + 1];
      if (inlineToken && inlineToken.type === "inline" && !token.attrGet("id")) {
        const used = (env.__headingIds = env.__headingIds || new Map());
        const base = slugifyHeading(inlineToken.content);
        const count = used.get(base) || 0;
        used.set(base, count + 1);
        token.attrSet("id", count === 0 ? base : `${base}-${count}`);
      }
      return defaultHeadingOpen(tokens, idx, options, env, self);
    };
  });

  eleventyConfig.addPairedShortcode("callout", function (content, type = "info", title = "") {
    const normalizedType = String(type || "info").toLowerCase();
    const resolvedTitle =
      title || CALLOUT_DEFAULTS[normalizedType] || normalizedType.toUpperCase();
    const escapedTitle = md.utils.escapeHtml(resolvedTitle);
    const renderedBody = md.render(String(content || "").trim()).replace(/\n{2,}/g, "\n");
    return `<aside class="eleventy-callout is-${normalizedType}">\n<div class="eleventy-callout-title">${escapedTitle}</div>\n<div class="eleventy-callout-body">\n${renderedBody}</div>\n</aside>\n`;
  });

  eleventyConfig.addFilter("extractToc", (htmlContent) => {
    if (!htmlContent) return [];
    const items = [];
    const re = /<h([23])\s+[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;
    while ((match = re.exec(htmlContent)) !== null) {
      const level = Number(match[1]);
      const id = match[2];
      const text = match[3].replace(/<[^>]+>/g, "").trim();
      if (text) items.push({ level, id, text });
    }
    return items;
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
    "node_modules/katex/dist/katex.min.css": "assets/katex.min.css",
    "node_modules/katex/dist/fonts": "assets/fonts",
    "node_modules/mermaid/dist/mermaid.min.js": "assets/mermaid.min.js"
  });
}

export const config = {
  pathPrefix: "/eleventy/",
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dir: {
    input: "src",
    includes: "_includes",
    data: "_data",
    output: "_site"
  }
};
