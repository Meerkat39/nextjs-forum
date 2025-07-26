'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { addComment, type CommentFormState } from '@/app/posts/actions';
import type { Post, Comment as CommentType } from '@prisma/client';

type PostWithComments = Post & { comments: CommentType[] };

// --- コメントフォームのコンポーネント ---
function CommentForm({ postId }: { postId: string }) {
  const initialState: CommentFormState = { message: '', errors: {} };
  const [state, formAction] = useActionState(addComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'コメントを投稿しました。') {
      formRef.current?.reset();
    }
  }, [state]);

  const { pending } = useFormStatus();

  return (
    <form action={formAction} ref={formRef} className="mt-6">
      <input type="hidden" name="postId" value={postId} />
      <textarea
        name="content"
        rows={3}
        className="w-full border rounded-md p-2"
        placeholder="コメントを追加..."
      />
      {state.errors?.content && <p className="text-red-500 text-sm">{state.errors.content}</p>}
      <div className="text-right mt-2">
        <button type="submit" disabled={pending} className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400">
          {pending ? '投稿中...' : 'コメントする'}
        </button>
      </div>
      {state.message === 'コメントを投稿しました。' && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
    </form>
  );
}


// --- 表示とインタラクションを担当するClient Component ---
export default function PostDetailClientPage({ post }: { post: PostWithComments }) {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link href="/posts" className="text-blue-500 hover:text-blue-700 hover:underline">
          &larr; 投稿一覧に戻る
        </Link>
      </div>

      <article className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          投稿日: {new Date(post.createdAt).toLocaleDateString('ja-JP')}
        </p>
        <div className="prose max-w-none text-gray-800">
          {post.content.split('\n').map((line, index) => (
            <p key={index} className="mb-4">{line || ' '}</p>
          ))}
        </div>
      </article>

      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">コメント</h2>
        {post.comments.length > 0 ? (
          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id} className="bg-white border rounded-md p-4 mb-4">
                <p>{comment.content}</p>
                <p className="text-xs text-gray-500 mt-2 text-right">{new Date(comment.createdAt).toLocaleString('ja-JP')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>まだコメントはありません。</p>
        )}
        
        <CommentForm postId={post.id} />
      </section>
    </main>
  );
}