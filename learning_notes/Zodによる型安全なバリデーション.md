## ✅ 結論
- Zodライブラリを導入し、Server Actions内の手動バリデーションを、宣言的で型安全なスキーマベースのバリデーションに置き換えた。
- これにより、バリデーションルールの管理が容易になり、コードの可読性と保守性が向上した。
- Zodが返すエラーオブジェクトの型と、`useActionState`で使う`FormState`の型を合わせることで、型安全なエラーハンドリングを実現した。

## 🧠 詳細
### 1. Zodのインストール
npm/yarn/pnpmなどを使って、プロジェクトに`zod`をインストールする。
```bash
npm install zod
```

### 2. スキーマの定義
アクションファイル(`actions.ts`)内で、検証したいデータの構造とルールを定義したスキーマを作成する。

`src/app/posts/actions.ts`
```ts
import { z } from "zod";

// 投稿用のスキーマ
const postSchema = z.object({
  // titleは文字列で、1文字以上必須
  title: z.string().min(1, { message: "タイトルは1文字以上で入力してください。" }),
  // contentも文字列で、1文字以上必須
  content: z.string().min(1, { message: "本文は1文字以上で入力してください。" }),
});

// コメント用のスキーマ
const commentSchema = z.object({
  content: z.string().min(1, { message: "コメントは1文字以上で入力してください。" }),
});
```
- `z.object()`: オブジェクト形式のデータを定義。
- `z.string()`: 値が文字列であることを定義。
- `.min(1, ...)`: 最小文字数を指定。第二引数でカスタムエラーメッセージを指定できる。

### 3. Server Action内でのバリデーション実行
`safeParse()`メソッドを使って、フォームから受け取ったデータをスキーマに対して検証する。

`src/app/posts/actions.ts`
```ts
export async function createPost(prevState, formData) {
  // フォームデータをオブジェクトに変換
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
  };

  // スキーマで検証
  const validatedFields = postSchema.safeParse(rawData);

  // バリデーション失敗時の処理
  if (!validatedFields.success) {
    return {
      message: "入力内容にエラーがあります。",
      // Zodのエラーを整形してstateに渡す
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // バリデーション成功時の処理
  // validatedFields.data には型安全なデータが入っている
  await prisma.post.create({
    data: {
      title: validatedFields.data.title,
      content: validatedFields.data.content,
    },
  });
  // ...
}
```
- **`safeParse()`**: パースに失敗してもエラーをthrowせず、結果を `{ success: boolean, ... }` 形式のオブジェクトで返す。
- **`validatedFields.error.flatten().fieldErrors`**: Zodのエラー情報を、`{ fieldName: ["エラーメッセージ"] }` という、フォームで扱いやすい形式に変換する。

### 4. `FormState`の型定義の調整
Zodの`fieldErrors`が返す型 (`string[]`) に合わせて、`FormState`の`errors`の型も修正する。

`src/app/posts/actions.ts`
```ts
export type FormState = {
  message: string;
  errors?: {
    title?: string[];   // stringからstring[]へ変更
    content?: string[]; // stringからstring[]へ変更
  };
};
```
これにより、Server Actionから返されるエラーオブジェクトと、それを受け取るクライアントコンポーネントの`state`の型が一致し、アプリケーション全体の型安全性が保たれる。

## 🏷️ Tags
#Zod #バリデーション #型安全 #Nextjs #ServerActions #学習メモ