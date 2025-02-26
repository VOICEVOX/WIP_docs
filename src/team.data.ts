/**
 * team.mdで使うチームメンバー一覧。
 *
 * NOTE:
 * - public/memberIcons/下に[GitHubのユーザー名].pngという名前でアイコンを配置するとそれが使われます。
 */
import fs from "node:fs/promises";
import { defineLoader } from "vitepress";
import type { DefaultTheme } from "vitepress/theme";

type Team = Section[];

type Section = {
  /** セクションの名前 */
  name: string;
  /** セクションのメンバー。キーはGitHubのユーザー名 */
  members: Record<string, Member>;
};

type Member = {
  /** 表示する名前 */
  name: string;
  /** アイコンの下のテキスト */
  role: string;
  /**
   * リンクのリスト。
   * キーはリンクのアイコンの名前で、値はリンクのURL。
   * リンクのアイコンはここを参照：https://icon-sets.iconify.design/simple-icons/?keyword=simple
   * その他、以下を追加している：
   * - "home"：家
   */
  links: Record<string, string>;
};

const team: Team = [
  {
    name: "メンテナー",
    members: {
      Hiroshiba: {
        name: "ヒホ",
        role: "TODO",
        links: {
          twitter: "https://twitter.com/hiho_karuta",
        },
      },
    },
  },
  {
    name: "レビュワー",
    members: {
      "sevenc-nanashi": {
        name: "名無し｡",
        role: "TODO",
        links: {
          twitter: "https://twitter.com/sevenc_nanashi",
          misskey: "https://voskey.icalo.net/@sevenc_nanashi",
          niconico: "https://www.nicovideo.jp/user/90184991",
        },
      },
    },
  },
];

const homeIconSvgRaw = await fs.readFile(
  `${import.meta.dirname}/../node_modules/@material-design-icons/svg/filled/home.svg`,
  "utf-8",
);
const homeIconSvg = homeIconSvgRaw.replace("0 0 24 24", "4 4 16 16");
// {
//   avatar: 'https://www.github.com/yyx990803.png',
//   name: 'Evan You',
//   title: 'Creator',
//   links: [
//     { icon: 'github', link: 'https://github.com/yyx990803' },
//     { icon: 'twitter', link: 'https://twitter.com/youyuxi' }
//   ]
// },
type VPTeamMemberData = {
  avatar: string;
  name: string;
  title: string;
  links: DefaultTheme.SocialLink[];
};

export default defineLoader({
  watch: [`${import.meta.dirname}/public/memberIcons`],
  load: async () => {
    const teamSections: { name: string; members: VPTeamMemberData[] }[] = [];
    for (const section of team) {
      const members: VPTeamMemberData[] = [];
      teamSections.push({
        name: section.name,
        members,
      });
      for (const [name, member] of Object.entries(section.members)) {
        const links = [
          { icon: "github", link: `https://github.com/${name}` },
          ...Object.entries(member.links).map(
            ([icon, link]): DefaultTheme.SocialLink => ({
              icon: icon === "home" ? { svg: homeIconSvg } : icon,
              link,
            }),
          ),
        ];
        const avatar = await fs
          .stat(`${import.meta.dirname}/public/memberIcons/${name}.png`)
          .then(
            () => `/memberIcons/${name}.png`,
            () => `https://www.github.com/${name}.png`,
          );
        members.push({
          avatar,
          name: member.name,
          title: member.role,
          links,
        });
      }
    }

    return teamSections;
  },
});
