import { defineConfig } from "vitepress";
import fs from "node:fs";

const getMdiSvg = (name: string) => {
  return {
    svg: fs.readFileSync(
      `${import.meta.dirname}/../../node_modules/@material-design-icons/svg/filled/${name}.svg`,
      "utf-8",
    ),
  };
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VOICEVOX Docs",
  description: "無料で使える中品質なテキスト読み上げソフトウェア。",
  lang: "ja-JP",
  base: "/voicevox_WIP_docs/",
  head: [["link", { rel: "icon", href: "/voicevox_WIP_docs/favicon.ico" }]],
  themeConfig: {
    logo: "/favicon-32x32.png",
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "エンジン",
        link: "/engine",
        items: [{ text: "Markdownテスト", link: "/engine/page01" }],
      },
      {
        text: "コア",
        link: "/core",
        items: [{ text: "テスト1", link: "/core/page01" }],
      },
      { text: "チーム", link: "/team" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/voicevox" },
      { icon: "twitter", link: "https://twitter.com/voicevox_pj" },
      {
        icon: getMdiSvg("home"),

        link: "https://voicevox.hiroshiba.jp",
      },
    ],
  },
  markdown: {
    container: {
      tipLabel: "Tips",
      warningLabel: "注意",
      dangerLabel: "警告",
      infoLabel: "情報",
      detailsLabel: "詳細",
    },
  },
});
