## ✅ 結論
- Next.jsプロジェクトにPrismaを導入し、データベースのスキーマ定義（PostとCommentモデル）を行った。
- IDには自動採番の整数ではなく、衝突しにくいランダムな文字列IDである`cuid()`を採用した。
- 開発用データベースとしてSQLiteを設定し、`prisma migrate dev`でテーブルを作成、`prisma generate`でPrisma Clientを生成した。

## 🧠 詳細
- **Prismaのインストール**:
  開発依存としてPrismaをインストールする。
  ```bash
  npm install prisma --save-dev
  ```

- **Prismaの初期化**:
  `prisma init`コマンドを実行し、`prisma/schema.prisma`と`.env`ファイルを生成する。
  ```bash
  npx prisma init
  ```

- **データベースプロバイダの変更**:
  `.env`ファイルの`DATABASE_URL`をSQLite用に変更し、`schema.prisma`の`provider`も`sqlite`に変更する。

  `.env`
  ```dotenv
  DATABASE_URL="file:./dev.db"
  ```

  `prisma/schema.prisma`
  ```prisma
  datasource db {
    provider = "sqlite" // ここをsqliteに変更
    url      = env("DATABASE_URL")
  }
  ```

- **モデル定義**:
  `schema.prisma`に`Post`と`Comment`モデルを定義し、リレーションを設定する。IDには`cuid()`を使用。

  `prisma/schema.prisma`
  ```prisma
  model Post {
    id        String   @id @default(cuid()) // String型でcuid()を使用
    title     String
    content   String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    comments  Comment[] // Commentモデルとのリレーション
  }

  model Comment {
    id        String   @id @default(cuid()) // String型でcuid()を使用
    content   String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    postId    String // PostのidがStringなので、ここもString
    post      Post     @relation(fields: [postId], references: [id]) // Postモデルへの参照
  }
  ```

- **マイグレーションの実行**:
  `schema.prisma`の定義に基づいてデータベースにテーブルを作成する。
  ```bash
  npx prisma migrate dev
  ```
  実行時にマイグレーション名（例: `init`）の入力を求められる。

- **Prisma Clientの生成**:
  TypeScriptコードからデータベースを型安全に操作するためのPrisma Clientを生成する。
  ```bash
  npx prisma generate
  ```

## 🏷️ Tags
#Prisma #データベース設計 #学習メモ #cuid #SQLite