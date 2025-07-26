## ✅ 結論
- Reactの`useActionState`フックを使うことで、Server Actionと連携したフォームの状態（送信中、成功、エラーなど）を管理し、ユーザーに分かりやすいフィードバックを提供できる。
- `useActionState`は、アクションの前回の状態(`prevState`)とフォームデータを引数に取るServer Actionと連携し、アクションが返した新しい状態をコンポーネントの`state`として更新する。
- 状態を管理するコンポーネントは`"use client"`ディレクティブでクライアントコンポーネントにする必要がある。

## 🧠 詳細
### `useActionState`の基本的な使い方
`useActionState`は、Server Actionと初期状態を引数に取り、現在の状態`state`と、フォームの`action`属性に渡すための新しい`formAction`を返す。

`src/app/posts/new/page.tsx`
```tsx
"use client";

import { useActionState } from "react";
import { createPost, type FormState } from "@/app/posts/actions";

// Server Actionが返す状態の初期値
const initialState: FormState = {
  message: "",
};

export default function NewPostPage() {
  // useActionStateフックの使用
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      {/* ...フォームの入力欄... */}
      
      {/* stateを使ってエラーメッセージを表示 */}
      {state.errors?.title && (
        <p>{state.errors.title}</p>
      )}
      {/* ... */}
    </form>
  );
}
```

### `useActionState`の引数と返り値の役割

`const [state, formAction] = useActionState(action, initialState);`

- **第一引数 (`action`)**:
  - **役割**: 「フォーム送信時に実行してほしいServer Action関数そのもの」をReactに教える。
  - **具体例**: `createPost`関数。
- **返り値 (`formAction`)**:
  - **役割**: `useActionState`が元のServer Actionをラップして作成した、「状態管理機能付きの新しいアクション」。これをフォームの`action`属性に渡すことで、Reactがフォームの送信を検知し、状態を更新できるようになる。
  - **注意点**: フォームには元のServer Action (`createPost`) ではなく、`useActionState`が返した`formAction`を設定する必要がある。

### Server Actionのシグネチャ（引数と返り値）
`useActionState`と連携するServer Actionは、第一引数に**前回の状態(`prevState`)**、第二引数に**フォームデータ(`formData`)**を受け取る必要がある。そして、処理結果を表現する**新しい状態オブジェクト**を`Promise`で返す。

`src/app/posts/actions.ts`
```ts
"use server";

// 状態オブジェクトの型定義
export type FormState = {
  message: string;
  errors?: {
    title?: string;
    content?: string;
  };
};

// Server Actionの実装
export async function createPost(
  prevState: FormState, // 第一引数: 前回の状態
  formData: FormData    // 第二引数: フォームデータ
): Promise<FormState> { // 返り値: 新しい状態
  
  // バリデーション処理
  if (!title) {
    // エラーがあれば、エラー情報を含んだ新しい状態を返す
    return { message: "エラー", errors: { title: "タイトルは必須です" } };
  }

  // データベースへの保存処理など

  // 成功した場合、成功メッセージを含んだ新しい状態を返す
  // redirect()を使う場合は、このreturnには到達しない
  return { message: "投稿に成功しました！" };
}
```

### `prevState`とは？
- **「前回のアクションが返した状態」**のこと。
- アクションが実行されるたびに、`useActionState`が管理している現在の`state`が、アクションの第一引数(`prevState`)として渡される。
- これにより、アクションは自身の前回の実行結果を知ることができる。

### `FormState`型とは？
- **「Server ActionがUIに伝えたい情報の設計図」**となる型。
- アクションが返しうる、あらゆる状態（成功メッセージ、エラーメッセージ、各フィールドのバリデーションエラーなど）を定義する。
- これにより、Server Actionとクライアントコンポーネントの間で、どのようなデータがやり取りされるかが明確になり、型安全性が向上する。

## 🏷️ Tags
#React #Nextjs #ServerActions #useActionState #状態管理 #学習メモ