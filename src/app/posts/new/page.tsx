"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  // フォームの情報を取得
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // データベースに保存
  await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  // 投稿一覧ページを再検証して最新の状態にする
  revalidatePath("/posts");

  // 投稿一覧ページにリダイレクト
  redirect("/posts");
}

export default async function NewPostPage() {
  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/posts"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          &larr; 投稿一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">新しい投稿を作成</h1>

      <form
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        action={createPost}
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-gray-700 font-bold mb-2"
          >
            本文
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            投稿する
          </button>
        </div>
      </form>
    </main>
  );
}
