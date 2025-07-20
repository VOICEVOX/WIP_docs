// ![audio](./hoge.mp3) で音声ファイルを置けるようにするプラグイン。

import { defineConfig } from "vitepress";
import path from "node:path";
import fs from "node:fs";

export default defineConfig({
  markdown: {
    config: (md) => {
      // altが"audio"の画像を<audio>要素に変換する

      const originalImage =
        md.renderer.rules.image ||
        ((tokens, idx, options) =>
          md.renderer.renderToken(tokens, idx, options));

      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        if (tokens[idx].content !== "audio") {
          return originalImage(tokens, idx, options, env, self);
        }

        const src = tokens[idx].attrGet("src");
        return `<audio controls src="${src}">音声ファイルを再生できません。</audio>`;
      };
    },
  },
  // audioのsrcもVueのURL書き換えの対象にする
  // https://github.com/vitejs/vite/discussions/14596#discussioncomment-7612494
  vue: {
    template: {
      transformAssetUrls: {
        video: ["src", "poster"],
        source: ["src"],
        img: ["src"],
        image: ["xlink:href", "href"],
        use: ["xlink:href", "href"],
        audio: ["src"], // newly added
      },
    },
  },
});
