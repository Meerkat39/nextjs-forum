"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
  message: string;
  errors?: {
    title?: string;
    content?: string;
  };
};

export async function createPost(prevState: FormState, formData: FormData) {
  // フォームの情報を取得
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // バリデーション
  const errors: FormState["errors"] = {};
  if (!title || title.trim().length === 0) {
    errors.title = "タイトルを入力してください。";
  }
  if (!content || content.trim().length === 0) {
    errors.content = "本文を入力してください。";
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: "入力内容にエラーがあります。",
      errors,
    };
  }

  try {
    // データベースに保存
    await prisma.post.create({
      data: {
        title,
        content,
      },
    });
  } catch (e) {
    return {
      message: "データベースエラーが発生しました。",
    };
  }

  // 投稿一覧ページを再検証して最新の状態にする
  revalidatePath("/posts");

  // 投稿一覧ページにリダイレクト
  redirect("/posts");
}

export type CommentFormState = {
  message: string;
  errors?: {
    content?: string;
  };
};

export async function addComment(
  precState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  // バリデーション
  if (!content || content.trim().length === 0) {
    return {
      message: "コメント本文を入力してください。",
      errors: { content: "コメント本文を入力してください" },
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
      },
    });

    // 詳細ページのキャッシュを再検証
    revalidatePath(`/posts/${postId}`);
    return { message: "コメントを投稿しました。", errors: {} };
  } catch (e) {
    return { message: "データベースエラーが発生しました。" };
  }
}
