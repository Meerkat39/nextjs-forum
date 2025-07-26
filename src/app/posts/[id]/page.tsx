import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostDetailClientPage from "./client-page";

type Props = {
  params: { id: string };
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

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

  return <PostDetailClientPage post={post} />;
}
