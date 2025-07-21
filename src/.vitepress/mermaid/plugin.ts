// Mermaidを読み込むためのVitePressプラグイン。
//
// VitePressのMarkdownレンダラーを拡張して、MermaidのコードブロックをMermaidDiagram要素に変換する。
// VitePressのテーマでMermaidDiagramコンポーネントを登録しておく（.vitepress/theme/index.tsを参照）。

import { MarkdownRenderer } from "vitepress";

export function mermaidMarkdownPlugin(md: MarkdownRenderer) {
  // ```mermaid のコードブロックをMermaidのHTML要素に変換する

  const originalCodeBlock =
    md.renderer.rules.fence ||
    ((tokens, idx, options) => md.renderer.renderToken(tokens, idx, options));

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    if (tokens[idx].info !== "mermaid") {
      return originalCodeBlock(tokens, idx, options, env, self);
    }

    const code = tokens[idx].content.trim();
    return `<ClientOnly><MermaidDiagram diagram="${escapeHtml(code)}"></MermaidDiagram></ClientOnly>`;
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
