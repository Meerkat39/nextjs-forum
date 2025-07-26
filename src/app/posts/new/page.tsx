"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost, FormState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
      disabled={pending}
    >
      {pending ? "送信中..." : "投稿する"}
    </button>
  );
}

export default function NewPostPage() {
  const initialState: FormState = {
    message: "",
  };
  const [state, formAction] = useActionState(createPost, initialState);

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
        action={formAction}
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
          />
          {state.errors?.title && (
            <p className="text-red-500 text-xs italic mt-2">
              {state.errors.title}
            </p>
          )}
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
          />
        </div>
        {state.errors?.content && (
          <p className="text-red-500 text-xs italic mt-2">
            {state.errors.content}
          </p>
        )}

        <div className="flex items-center justify-end">
          <SubmitButton />
        </div>

        {state.message && !state.errors && (
          <p className="text-green-500 text-sm mt-4">{state.message}</p>
        )}
        {state.message && state.errors && (
          <p className="text-green-500 text-sm mt-4">{state.message}</p>
        )}
      </form>
    </main>
  );
}
