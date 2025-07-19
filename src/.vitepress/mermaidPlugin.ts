// Mermaidを読み込むためのVitePressプラグイン。
//
// # 大まかな仕組み
// - VitePressのMarkdownレンダラーを拡張して、Mermaidのコードブロックをカスタム要素（`<div is="mermaid-diagram">`）に変換する。
// - `mermaid-diagram`要素を定義するためのファイルを読み込むscriptをHTMLに追加する。
// - Mermaidのレンダリングは`mermaidLoader.ts`で定義されている`mermaid-diagram`カスタム要素で行う。

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
        return `<div is="mermaid-diagram">${fromByteArray(encoded)}</div>`;
      };
    },
  },
  vite: {
    plugins: [
      {
        name: "mermaid-client-loader",
        transformIndexHtml: {
          order: "pre",
          handler: function (html) {
            // Vitepressのhead操作ではHTMLのscriptタグのimportを操作しないため、order: "pre"のtransformIndexHtmlでロードする
            return html.replace(
              "</head>",
              `<script type="module" src="/.vitepress/mermaidLoader.ts"></script></head>`,
            );
          },
        },
      },
    ],
  },
});
