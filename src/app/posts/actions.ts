"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const postSchema = z.object({
  title: z
    .string()
    .min(1, { message: "タイトルは1文字以上で入力してください。" }),
  content: z
    .string()
    .min(1, { message: "本文は1文字以上で入力してください。" }),
});

const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "コメントは1文字以上で入力してください。" }),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
  };
};

export async function createPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // フォームの情報を取得
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
  };

  // Zodスキーマでデータを検証
  const validatedFields = postSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "入力内容にエラーがあります。",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // データベースに保存
    await prisma.post.create({
      data: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
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
    content?: string[];
  };
};

export async function addComment(
  precState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const postId = formData.get("postId") as string;
  const validatedFields = commentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      message: "入力内容にエラーがあります。",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.comment.create({
      data: {
        content: validatedFields.data.content,
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

export type UpdateFormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
  };
};

export async function updatePost(
  prevState: UpdateFormState,
  formData: FormData
): Promise<UpdateFormState> {
  // フォームの情報を取得
  const postId = formData.get("postId") as string;
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
  };

  // Zodスキーマでデータを検証
  const validatedFields = postSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "入力内容にエラーがあります。",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // データベースを更新
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
      },
    });
  } catch (e) {
    return {
      message: "データベースの更新中にエラーが発生しました。",
    };
  }

  // キャッシュを再検証
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);

  // redirect() は try...catch の外で呼び出す
  redirect(`/posts/${postId}`);
}
