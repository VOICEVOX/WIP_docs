import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VOICEVOX Docs",
  description: "無料で使える中品質なテキスト読み上げソフトウェア。",
  lang: "ja-JP",
  base: "/WIP_docs/",
  head: [["link", { rel: "icon", href: "/WIP_docs/favicon.ico" }]],
  cleanUrls: true,
  themeConfig: {
    logo: "/favicon-32x32.png",

    outlineTitle: "目次",
    returnToTopLabel: "最上部に戻る",
    sidebarMenuLabel: "メニュー",
    darkModeSwitchLabel: "テーマ",
    lightModeSwitchTitle: "ライトテーマに切り替える",
    darkModeSwitchTitle: "ダークテーマに切り替える",
    docFooter: {
      next: "次のページ",
      prev: "前のページ",
    },

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
          items: [{ text: "テスト1", link: "/engine/page01" }],
        },
      ],
      "/core/": [
        {
          text: "コア",
          link: "/core/",
          items: [
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
