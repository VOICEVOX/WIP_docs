// 画像の記法で音声ファイルを埋め込めるようにするためのVitePressプラグイン

import { defineConfig } from "vitepress";

const audioExtensions = ["mp3", "wav", "ogg", "flac"];
export default defineConfig({
  markdown: {
    config: (md) => {
      const originalImage =
        md.renderer.rules.image ||
        ((tokens, idx, options) =>
          md.renderer.renderToken(tokens, idx, options));

      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const src = tokens[idx].attrGet("src");
        if (!src || !audioExtensions.some((ext) => src.endsWith(`.${ext}`))) {
          return originalImage(tokens, idx, options, env, self);
        }

        return `<audio controls src="${src}">${tokens[idx].content}</audio>`;
      };
    },
  },
  // audioのsrcもVueのURL書き換えの対象にする
  // https://github.com/vitejs/vite/discussions/14596#discussioncomment-7612494
  vue: {
    template: {
      transformAssetUrls: {
        audio: ["src"],

        // 元の設定（ https://github.com/vuejs/core/blob/e60edc06f29b32c8f3a44d0ab3558a0569515e8f/packages/compiler-sfc/src/template/transformAssetUrl.ts#L37 ）
        video: ["src", "poster"],
        source: ["src"],
        img: ["src"],
        image: ["xlink:href", "href"],
        use: ["xlink:href", "href"],
      },
    },
  },
});
