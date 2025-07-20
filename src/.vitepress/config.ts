import { DefaultTheme, UserConfig } from "vitepress";
import audioPlugin from "./audioPlugin.ts";
import mermaidPlugin from "./mermaid/plugin.ts";

/** configをマージする関数。
 * (config1, config2, config3)という引数で呼び出すと、
 * `{ extends: { extends: config3, ...config2 }, ...config1 }`のようにマージされる。
 */
function mergeConfigs(
  ...configs: Omit<UserConfig<DefaultTheme.Config>, "extends">[]
): UserConfig<DefaultTheme.Config> {
  return configs.slice(1).reduce((merged, config) => {
    return {
      ...config,
      extends: merged,
    };
  }, configs[0]);
}

// https://vitepress.dev/reference/site-config
export default mergeConfigs(mermaidPlugin, audioPlugin, {
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
