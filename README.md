# My Web Site Gallery

GitHub Pagesで公開しているWebサイトを一覧表示する静的ポータルサイトです。
`TKG-afk` のGitHub Pages設定から取得したサイトを、トップページのスクリーンショット画像ボタン付きで表示します。

2026-06-30時点で38サイトを収録し、GitHubリポジトリの `createdAt` を使って新しい順に表示しています。

## 編集する場所

サイト一覧は `data/sites.json` で管理します。`createdAt` は新しい順に自動で並び替えられます。
サムネイル画像は `images/pages/` に保存しています。

```json
{
  "title": "サイト名",
  "description": "サイトの説明",
  "url": "https://example.github.io/site/",
  "repoUrl": "https://github.com/user/repository",
  "thumbnail": "./images/pages/site01.png",
  "createdAt": "2026-06-15T04:17:12Z",
  "tags": ["portfolio"]
}
```

`thumbnail` が空、または画像の読み込みに失敗した場合はグレーのプレースホルダーを表示します。

## ローカル確認

JSONを読み込むため、直接HTMLを開くよりローカルサーバーで確認してください。

```powershell
cd my-web-site-gallery
python -m http.server 4173
```

その後、`http://localhost:4173/` を開きます。
