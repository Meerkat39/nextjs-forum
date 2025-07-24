import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 既存のデータを全削除（削除順序に注意）
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  console.log("Deleted all posts and comments.");

  // 1つ目の投稿とコメントを作成
  const post1 = await prisma.post.create({
    data: {
      title: "Prismaを使ってみた",
      content: "Prismaは型安全で、データベース操作がとても簡単になります。",
      comments: {
        create: [
          { content: "本当にそう思います！" },
          { content: "補完が効くのが最高ですよね。" },
        ],
      },
    },
  });

  // 2つ目の投稿とコメントを作成
  const post2 = await prisma.post.create({
    data: {
      title: "Next.js App Routerの感想",
      content:
        "App Routerは、サーバーコンポーネントとクライアントコンポーネントの使い分けが重要ですね。",
      comments: {
        create: [{ content: "最初は戸惑いましたが、慣れると便利ですね。" }],
      },
    },
  });

  // 3つ目の投稿（コメントなし）を作成
  const post3 = await prisma.post.create({
    data: {
      title: "Tailwind CSSはいいぞ",
      content:
        "ユーティリティファーストなCSSフレームワークで、デザインの自由度が高いです。",
    },
  });

  console.log({ post1, post2, post3 });

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
