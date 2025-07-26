"use client";
import { Post } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateFormState, updatePost } from "../../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 
      rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
      disabled={pending}
    >
      {pending ? "更新中..." : "更新する"}
    </button>
  );
}

export default function EditPostClientPage({ post }: { post: Post }) {
  const initialState: UpdateFormState = { message: "", errors: {} };

  const [state, formAction] = useActionState(updatePost, initialState);

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href={`/posts/${post.id}`}
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          &larr; 投稿詳細に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">投稿を編集</h1>

      <form
        action={formAction}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <input type="hidden" name="postId" value={post.id} />
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={post.title}
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
            defaultValue={post.content}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            更新する
          </button>
        </div>
      </form>
    </main>
  );
}
