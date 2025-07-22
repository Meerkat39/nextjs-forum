## ✅ 結論
- Prismaのシーディング機能を利用して、開発用の初期データ（ダミーデータ）をデータベースに投入する仕組みを構築した。
- `prisma/seed.ts`にデータ作成処理を記述し、`package.json`で実行コマンドを設定後、`npx prisma db seed`で実行する。

## 🧠 詳細
- **シーディングとは？**
  アプリケーション開発の初期段階で、動作確認のために手動でデータを投入するのは非効率。シーディングは、スクリプトを実行することで、あらかじめ定義した初期データをデータベースに自動で投入する仕組み。

- **手順1: シードスクリプトの作成 (`prisma/seed.ts`)**
  データベースに投入したいデータを定義するTypeScriptファイルを作成する。

  `prisma/seed.ts`
  ```ts
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  async function main() {
    console.log(`Start seeding ...`);

    // 既存のデータをクリア
    await prisma.post.deleteMany();

    // 新しいデータを作成
    await prisma.post.createMany({
      data: [
        {
          title: 'Prismaを使ってみた',
          content: 'Prismaは型安全で、データベース操作がとても簡単になります。',
        },
        {
          title: 'Next.js App Routerの感想',
          content: 'App Routerは、サーバーコンポーネントとクライアントコンポーネントの使い分けが重要ですね。',
        },
      ],
    });
    console.log(`Seeding finished.`);
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  ```

- **手順2: `package.json` の設定**
  `prisma db seed`コマンドがどのファイルを実行すればよいかをPrismaに教えるため、`package.json`に設定を追加する。

  `package.json`
  ```json
  {
    // ...
    "prisma": {
      "seed": "tsx prisma/seed.ts"
    },
    // ...
  }
  ```

- **手順3: `tsx` のインストール**
  TypeScriptファイル(`seed.ts`)を直接実行するためのパッケージ`tsx`をインストールする。

  ```bash
  npm install tsx --save-dev
  ```

- **手順4: シードコマンドの実行**
  以下のコマンドで、`package.json`の設定に従って`seed.ts`が実行され、データベースにデータが投入される。

  ```bash
  npx prisma db seed
  ```

## 🏷️ Tags
#Prisma #データベース #シーディング #学習メモ #初期データ