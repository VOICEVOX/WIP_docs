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
        return `<audio controls src="${src}"></audio>`;
      };
    },
  },
  async transformHtml(code, destPath, ctx) {
    // audio要素のsrc属性に指定された音声ファイルをビルド先にコピーする

    const sourcePath = `${ctx.siteConfig.srcDir}/${ctx.page}`;
    const audios = code.matchAll(/<audio[^>]+src="([^"]+)"[^>]*>/g);
    for (const audio of audios) {
      const src = audio[1];
      if (src) {
        if (src.startsWith("http://") || src.startsWith("https://")) {
          // URLはそのまま
          continue;
        } else if (src.startsWith("/")) {
          // 一旦絶対パスは使えないことにする
          throw new Error(
            `音声ファイルのパスは相対パスで指定してください: ${src}`,
          );
        } else {
          const srcFsPath = `${path.dirname(sourcePath)}/${src}`;
          const destFsPath = `${path.dirname(destPath)}/${src}`;
          await fs.promises.copyFile(srcFsPath, destFsPath);
        }
      }
    }
  },
});
