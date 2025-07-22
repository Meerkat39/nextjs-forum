import prisma from "@/lib/prisma";
import Link from "next/link";

// 投稿一覧の取得
async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export default async function PostPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">投稿一覧</h1>
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            新規投稿
          </Link>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Link
                href={`/posts/${post.id}`}
                className="text-xl font-semibold text-blue-700 hover:underline"
              >
                {post.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
