// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 既存の投稿をすべて削除
  await prisma.post.deleteMany();
  console.log("Deleted all posts.");

  // 新しい投稿を作成
  await prisma.post.createMany({
    data: [
      {
        title: "Prismaを使ってみた",
        content: "Prismaは型安全で、データベース操作がとても簡単になります。",
      },
      {
        title: "Next.js App Routerの感想",
        content:
          "App Routerは、サーバーコンポーネントとクライアントコンポーネントの使い分けが重要ですね。",
      },
      {
        title: "Tailwind CSSはいいぞ",
        content:
          "ユーティリティファーストなCSSフレームワークで、デザインの自由度が高いです。",
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
