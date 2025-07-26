import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostClientPage from "./client-page";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  // URLから投稿IDを取得
  const { id } = await params;

  // データベースから投稿データを取得
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return <EditPostClientPage post={post} />;
}
