// Mermaidを読み込むためのVitePressプラグイン。
//
// # 大まかな仕組み
// - VitePressのMarkdownレンダラーを拡張して、MermaidのコードブロックをMermaidDiagram要素に変換する。
// - VitePressのテーマでMermaidDiagramコンポーネントを登録しておく（.vitepress/theme/index.tsを参照）。

import { fromByteArray } from "base64-js";
import { defineConfig } from "vitepress";

export default defineConfig({
  markdown: {
    config: (md) => {
      // ```mermaid のコードブロックをMermaidのHTML要素に変換する

      const originalCodeBlock =
        md.renderer.rules.fence ||
        ((tokens, idx, options) =>
          md.renderer.renderToken(tokens, idx, options));

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        if (tokens[idx].info !== "mermaid") {
          return originalCodeBlock(tokens, idx, options, env, self);
        }

        const code = tokens[idx].content.trim();
        const encoded = new TextEncoder().encode(code);
        // HTMLエスケープ周りが面倒なので、Base64を使う
        return `<ClientOnly><MermaidDiagram base64Diagram="${fromByteArray(encoded)}"></MermaidDiagram></ClientOnly>`;
      };
    },
  },
});
