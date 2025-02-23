<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const maintainers = [
  {
    avatar: 'https://github.com/hiroshiba.png',
    name: 'ヒホ',
    title: '（役割とか入れれるらしい）',
    links: [
      { icon: 'github', link: 'https://github.com/hiroshiba' },
      { icon: 'twitter', link: 'https://twitter.com/hiho_karuta' }
    ]
  },
  {
    avatar: 'https://github.com/y-chan.png',
    name: 'Yちゃん',
    title: '（役割とか入れれるらしい）',
    links: [
      { icon: 'github', link: 'https://github.com/y-chan' },
      { icon: 'twitter', link: 'https://twitter.com/y_chan_dev' }
    ]
  },
  {
    avatar: 'https://github.com/qryxip.png',
    name: 'qryxip',
    title: '（役割とか入れれるらしい）',
    links: [
      { icon: 'github', link: 'https://github.com/qryxip' },
    ]
  },
]

const members = [
  {
    avatar: 'https://github.com/sevenc-nanashi.png',
    name: '名無し｡',
    title: '↓ニコニコとかMisskeyにも対応している、すごい',
    links: [
      { icon: 'github', link: 'https://github.com/sevenc-nanashi' },
      { icon: 'twitter', link: 'https://twitter.com/sevenc_nanashi' },
      { icon: 'misskey', link: 'https://voskey.icalo.net/@sevenc_nanashi' },
      { icon: 'niconico', link: 'https://www.nicovideo.jp/user/90184991' },
    ]
  },
  // TODO: ちゃんと作るなら整備する
]
</script>

# VOICEVOX チーム

こういう紹介ページも作れるらしい：<https://vitepress.dev/reference/default-theme-team-page#add-sections-to-divide-team-members>

## メンテナー

<VPTeamMembers size="small" :members="maintainers" />

## メンバー

<VPTeamMembers size="small" :members="members" />
