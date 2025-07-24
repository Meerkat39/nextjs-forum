import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/posts"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          &larr; 投稿一覧に戻る
        </Link>
      </div>

      {/* 投稿の本文 */}
      <article className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {post.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          投稿日: {new Date(post.createdAt).toLocaleDateString("ja-JP")}
        </p>
        <div className="prose max-w-none text-gray-800">
          {post.content.split('\n').map((line, index) => (
            <p key={index} className="mb-4">{line || ' '}</p>
          ))}
        </div>
      </article>

      {/* コメントセクション */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">コメント</h2>
        {post.comments.length > 0 ? (
          <ul className="space-y-4">
            {post.comments.map((comment) => (
              <li key={comment.id} className="bg-white border border-gray-200 rounded-md p-4">
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {new Date(comment.createdAt).toLocaleString("ja-JP")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">まだコメントはありません。</p>
        )}
      </section>
    </main>
  );
}