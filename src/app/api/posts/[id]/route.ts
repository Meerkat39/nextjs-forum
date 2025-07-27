import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 投稿に関連するすべてのコメントの削除
    await prisma.comment.deleteMany({
      where: {
        postId: id,
      },
    });

    // 投稿の削除
    await prisma.post.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "投稿を削除しました。" });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "データベースエラーが発生しました。" }),
      { status: 500 }
    );
  }
}
