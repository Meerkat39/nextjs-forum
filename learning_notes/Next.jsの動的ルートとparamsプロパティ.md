## ✅ 結論
Next.jsのApp Routerでは、URLの動的な部分（動적ルートセグメント、例: `/posts/[id]`の`[id]`部分）の値は、ページのコンポーネントに`params`という名前のプロパティ（props）として渡される。これにより、URLに応じて表示内容が変わる動的なページを簡単に生成できる。

## 🧠 詳細
Next.jsのApp Routerは、ファイルシステムのディレクトリ構造に基づいてルーティングを自動的に決定します。

### 動的ルートの作成方法
ディレクトリ名を角括弧`[]`で囲むことで、その部分が動的なセグメントであることを示します。
例えば、`app/posts/[id]/page.tsx`というファイル構造は、`/posts/abc`や`/posts/123`といったURLに対応します。

### `params`プロパティの受け取り方
`page.tsx`コンポーネントは、引数として`props`（プロパティ）を受け取ります。この`props`は、`{ params: { id: "..." } }` のような構造のオブジェクトです。

#### `{ params }: { params: { id: string } }` の分解解説

この記述は、**「引数の分割代入」**と**「TypeScriptの型定義」**という2つのテクニックを同時に使っているため、少し複雑に見えます。

1.  **`{ params: { id: string } }` (コロンの右側)**
    *   これは**TypeScriptの型定義**です。
    *   「このコンポーネントが受け取る引数（`props`）は、`params`というプロパティを持つオブジェクトです。そして、その`params`プロパティ自体もオブジェクトで、`id`という`string`型のプロパティを持っています」と型を宣言しています。
    *   `props`の型: `{ params: { id: string } }`

2.  **`{ params }` (コロンの左側)**
    *   これは**JavaScriptの分割代入**というテクニックです。
    *   `props`オブジェクトから、`params`プロパティだけを取り出して、`params`という名前の変数として直接使えるようにしています。
    *   もし分割代入を使わない場合、コードは以下のようになります。
        ```tsx
        // propsをそのまま受け取る
        export default function PostDetailPage(props: { params: { id: string } }) {
          // propsの中からparamsを取り出して使う
          const id = props.params.id;
          return (
            <div>
              <h1>投稿詳細ページ</h1>
              <p>投稿ID: {id}</p>
            </div>
          );
        }
        ```
    *   分割代入を使うことで、`props.params.id`と書く手間を省き、`params.id`と直接書けるようになり、コードがスッキリします。

#### 具体的なコード例
`app/posts/[id]/page.tsx`

```tsx
// 引数の型定義と分割代入を同時に行っている
export default function PostDetailPage({ params }: { params: { id: string } }) {
  // もしブラウザで /posts/clq70a1230000c9s6g1z4a2b1 というURLにアクセスした場合、
  // params.id の値は、文字列 "clq70a1230000c9s6g1z4a2b1" になります。
  return (
    <div>
      <h1>投稿詳細ページ</h1>
      <p>このページの投稿IDは: {params.id} です。</p>
    </div>
  );
}
```

#### 型エイリアス(Type Alias)を使った書き方
コンポーネントの引数の型定義が長くなると、コードが読みにくくなることがあります。その場合、TypeScriptの**型エイリアス（Type Alias）**を使って、型に別名を付けると便利です。

例えば、`{ params: { id: string } }` という型に `Props` という名前を付けてみましょう。

```tsx
// 1. Propsという名前で型を定義する
type Props = {
  params: { id: string };
};

// 2. コンポーネントの引数でその型を使う
export default function PostDetailPage({ params }: Props) {
  return (
    <div>
      <h1>投稿詳細ページ</h1>
      <p>このページの投稿IDは: {params.id} です。</p>
    </div>
  );
}
```
このように書くことで、コンポーネントの引数部分が `({ params }: Props)` とスッキリし、どのような型のデータを受け取るのかが分かりやすくなります。

> **補足:**
> `type Props = { params: Promise<{id: string}>; };` のように、`params`を`Promise`でラップする型定義を見かけることがあるかもしれませんが、ページの`params`プロパティ自体はPromiseではありません。`params`は、ページがレンダリングされる時点で解決済みのオブジェクトです。Next.jsの一部の特殊な関数（例: `generateStaticParams`）では`Promise`を返すことがありますが、ページコンポーネントのpropsの型付けでは`Promise`は不要です。

### ポイント
- `params`オブジェクトのキー（この例では`id`）は、動的ルートのディレクトリ名（`[id]`）に対応します。もしディレクトリ名が`[slug]`であれば、`params.slug`で値を取得します。
- `params`オブジェクトの値は、常に`string`型です。URLが`/posts/123`であっても、`params.id`は数値の`123`ではなく、文字列の`"123"`になる点に注意が必要です。

## 🏷️ Tags
#Nextjs #AppRouter #DynamicRouting #TypeScript #分割代入 #学習メモ