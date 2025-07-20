import { defineConfig } from "vitepress";
import mermaidPlugin from "./mermaid/plugin.ts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VOICEVOX Docs",
  description: "無料で使える中品質なテキスト読み上げソフトウェア。",
  lang: "ja-JP",
  base: "/WIP_docs/",
  head: [
    // 公開時はnoindexを削除する
    ["meta", { name: "robots", content: "noindex" }],

    ["meta", { name: "theme-color", content: "#a5d4ad" }],
    ["link", { rel: "icon", href: "/WIP_docs/favicon.ico" }],
  ],
  cleanUrls: true,
  extends: mermaidPlugin,
  themeConfig: {
    logo: "/favicon-32x32.png",

    outlineTitle: "目次",

    nav: [
      { text: "ホーム", link: "/" },
      { text: "エンジン", link: "/engine/" },
      { text: "コア", link: "/core/" },
    ],

    sidebar: {
      "/": [
        { text: "全体構成", link: "/architecture" },
        { text: "チーム", link: "/team" },
      ],
      "/engine/": [
        {
          text: "エンジン",
          link: "/engine/",
          items: [
            { text: "クイックスタート", link: "/engine/" },
            { text: "テスト1", link: "/engine/page01" },
          ],
        },
      ],
      "/core/": [
        {
          text: "コア",
          link: "/core/",
          items: [
            { text: "クイックスタート", link: "/core/" },
            { text: "テスト1", link: "/core/page01" },
            { text: "ダウンローダー", link: "/core/downloader" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/voicevox" },
      { icon: "twitter", link: "https://twitter.com/voicevox_pj" },
    ],
  },
});
