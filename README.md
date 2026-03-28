# wip_docs

VOICEVOXを利用する開発者向けのドキュメント（工事中）。
関連Issue：<https://github.com/VOICEVOX/voicevox_core/issues/1001>

## 動かす

```bash
pnpm run dev
```

## GitHub Actions のバージョン固定

[pinact](https://github.com/suzuki-shunsuke/pinact) を使って GitHub Actions のバージョンを full-length commit SHA に固定しています。
プルリクエストを送ると自動でテストされます。

```bash
# バージョンを固定する
pinact run

# バージョンを更新して固定する
pinact run --update --min-age 7
```

## ライセンス

[LICENSE](LICENSE) を参照してください。
