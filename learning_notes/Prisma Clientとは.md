## ✅ 結論
Prisma Clientは、TypeScript/JavaScriptコードとデータベースを繋ぐ、**自動生成される「超優秀な通訳さん」**である。

SQLを直接書く代わりに、`prisma.post.findMany()`のような型安全なメソッドでデータベースを操作できるため、開発効率と安全性が飛躍的に向上する。

## 🧠 詳細
Prisma Clientは、`npx prisma generate`コマンドによって`schema.prisma`のモデル定義から自動生成される、データベース操作専用のライブラリ。

### なぜ必要か？ (Before / After)

#### Before: SQLを直接書く場合
SQL文を文字列としてコード内に記述する必要があり、タイプミスやテーブル構造の変更に気づきにくい。
```sql
-- SQLはただの文字列なので、エディタの補完や型チェックが効かない
SELECT * FROM "Post" WHERE "id" = '...';
```

#### After: Prisma Clientを使う場合
使い慣れたJavaScript/TypeScriptのメソッドで、型安全にデータベースを操作できる。
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// postモデルのfindUniqueメソッドを呼び出すだけ
// 間違ったメソッド名や引数はエディタがエラーを出す
const post = await prisma.post.findUnique({
  where: { id: '...' },
});
```

### 主なメリット
1.  **完璧な型安全性**:
    `prisma.post`のようにモデル名を入力すると、`findMany`や`create`などの操作メソッドが自動補完される。取得したデータ（例: `post`）のプロパティ（`post.title`など）も型定義されているため、タイプミスは即座にエラーとして検知される。

2.  **SQL不要**:
    基本的なCRUD（作成、読み取り、更新、削除）操作は、SQLを一行も書かずに実現できる。

3.  **自動更新**:
    `schema.prisma`ファイルを変更して`prisma generate`を実行するたびに、Prisma Clientも最新のデータベース構造に合わせて自動で更新される。

### Next.js開発環境での注意点：インスタンスのシングルトン化

Next.jsの開発モードでは、ファイルを変更するたびにコードが再読み込みされる（ホットリロード）。
単純に`new PrismaClient()`を毎回実行すると、データベース接続が際限なく増え、エラーの原因となる。

これを防ぐため、`globalThis`オブジェクトを利用してPrisma Clientのインスタンスを一度だけ生成し、それを使い回す「シングルトンパターン」を実装するのがベストプラクティスである。

`lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// globalThis.prismaが存在すればそれを使い、なければ新しいインスタンスを生成
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// 開発環境でのみ、生成したインスタンスをグローバルに保持する
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
```

## 🏷️ Tags
#Prisma #PrismaClient #ORM #データベース #学習メモ #Nextjs
