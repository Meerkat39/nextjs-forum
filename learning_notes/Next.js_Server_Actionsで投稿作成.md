## ✅ 結論
- Next.jsのServer Actionsを利用して、クライアントサイドのフォームから直接サーバーサイドでデータベースへの投稿保存処理を実装した。
- 投稿後、`revalidatePath`でキャッシュを再検証し、`redirect`で投稿一覧ページへ遷移させた。

## 🧠 詳細
- **Server Actionsの定義**:
  - ファイルの先頭に`"use server";`ディレクティブを記述することで、そのファイル内の関数がサーバー上で実行されるServer Actionとしてマークされる。
  - フォームから送信されたデータは`FormData`オブジェクトとしてServer Actionの引数で受け取る。
  ```typescript
  // src/app/posts/new/page.tsx (抜粋)
  "use server"; // ファイルの先頭に記述

  import prisma from "@/lib/prisma"; // Prismaクライアントのインポート
  import { redirect } from "next/navigation";
  import { revalidatePath } from "next/cache";

  export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // データベースに新しい投稿を保存
    await prisma.post.create({
      data: {
        title,
        content,
      },
    });

    // 投稿一覧ページ(/posts)のキャッシュを無効化し、次回アクセス時に最新データを取得させる
    revalidatePath("/posts");

    // 投稿一覧ページへリダイレクト
    redirect("/posts");
  }
  ```

- **フォームとの連携**:
  - HTMLの`<form>`タグの`action`属性に、定義したServer Action関数を直接指定する。
  - `input`や`textarea`の`name`属性が、`formData.get()`で値を取得する際のキーとなる。
  ```tsx
  // src/app/posts/new/page.tsx (抜粋)
  export default function NewPostPage() {
    return (
      <main>
        {/* ...省略... */}
        <form action={createPost}> {/* ここでServer Actionを指定 */}
          <div>
            <label htmlFor="title">タイトル</label>
            <input type="text" id="title" name="title" required /> {/* name="title" */}
          </div>
          <div>
            <label htmlFor="content">本文</label>
            <textarea id="content" name="content" rows={8} required /> {/* name="content" */}
          </div>
          <div>
            <button type="submit">投稿する</button>
          </div>
        </form>
      </main>
    );
  }
  ```

- **`revalidatePath`と`redirect`**:
  - `revalidatePath("/posts")`: データベースの更新後、Next.jsのデータキャッシュを強制的に無効化し、`/posts`パスへの次回のアクセスで最新のデータを再フェッチさせるために使用する。これにより、新しい投稿がすぐに一覧に反映される。
  - `redirect("/posts")`: 投稿保存処理が完了した後、ユーザーを`/posts`パス（投稿一覧ページ）へ自動的に遷移させるために使用する。

## 🏷️ Tags
#Nextjs #ServerActions #Prisma #revalidatePath #redirect #学習メモ