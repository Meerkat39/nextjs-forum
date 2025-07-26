## ✅ 結論
- Next.jsのAPI Routesは、`app/api`ディレクトリ以下に`route.ts`ファイルを作成することで、特定のURLへのリクエストを処理するAPIエンドポイントを簡単に構築できる機能。
- `GET`, `POST`, `DELETE`などのHTTPメソッドに対応した名前の関数を`export`することで、それぞれのメソッドを処理する。
- フォーム送信と密接に連携するServer Actionsとは異なり、クライアントサイドからの単純な`fetch`リクエストに応じて、データの読み取り(Read)や、今回の削除(Delete)のような操作を実行するのに適している。

## 🧠 詳細
### API Routeの作成
`app/api/posts/[id]/route.ts` のように、動的ルートを使って特定の投稿を対象とするAPIエンドポイントを作成した。

`src/app/api/posts/[id]/route.ts`
```ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETEリクエストを処理する関数
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id; // URLから投稿IDを取得

  try {
    // 関連するコメントを先に削除
    await prisma.comment.deleteMany({
      where: { postId: id },
    });

    // 投稿自体を削除
    await prisma.post.delete({
      where: { id: id },
    });

    // 成功レスポンスを返す
    return NextResponse.json({ message: "投稿を削除しました。" });

  } catch (error) {
    // エラーレスポンスを返す
    return new NextResponse(
      JSON.stringify({ message: "データベースエラーが発生しました。" }),
      { status: 500 }
    );
  }
}
```
- **`export async function DELETE(...)`**: `DELETE`という名前で関数をエクスポートすることで、`DELETE`メソッドのリクエストを処理する。
- **`params`**: 関数の第二引数の`params`オブジェクトから、動的ルートの`[id]`部分を取得できる。
- **`NextResponse`**: `NextResponse.json()`や`new NextResponse()`を使って、クライアントに返すレスポンス（データやエラーステータス）を柔軟に作成できる。

### クライアントからの呼び出し
Client Componentから`fetch` APIを使って、作成したAPIエンドポイントを呼び出す。

`src/app/posts/[id]/client-page.tsx`
```tsx
"use client";
import { useRouter } from "next/navigation";

// ...

const router = useRouter();

const handleDelete = async () => {
  if (confirm("本当にこの投稿を削除しますか？")) {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE", // DELETEメソッドを指定
      });

      if (!res.ok) {
        throw new Error("削除に失敗しました。");
      }
      
      alert("投稿を削除しました。");
      router.push("/posts"); // 一覧ページへ遷移
      router.refresh();    // ページを更新してキャッシュをクリア
    } catch (error) {
      alert("エラーが発生しました。");
    }
  }
};
```
- **`fetch('/api/posts/${post.id}', ...)`**: 作成したAPIのURLを叩く。
- **`method: "DELETE"`**: `DELETE`関数を呼び出すために、HTTPメソッドを明示的に指定する。
- **`useRouter`**: `router.push()`でページ遷移、`router.refresh()`でUIの再描画とキャッシュの更新を行う。

## 🏷️ Tags
#Nextjs #APIRoutes #学習メモ #CRUD #fetch