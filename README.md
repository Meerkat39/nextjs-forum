# nextjs-forum

## 概要

このアプリは、ユーザーが投稿を作成し、コメントを付けられる簡易フォーラムシステムです。

認証機能は実装せず、誰でも自由に投稿・コメントができるシンプルな構成になっています。  

このプロジェクトは、**Next.js（App Router）におけるServer ActionsとAPI Routesの使い分けや、Prismaとの連携を実践的に学ぶこと**を目的に制作しました。

## デモ

※開発中

## 主な機能

- 投稿一覧表示
- 投稿の作成・編集・削除
- 投稿詳細ページ
- 投稿へのコメント追加・表示
- 入力バリデーション（Zod）

## 使用技術

- **Next.js**（App Router構成）
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Prisma**（DBスキーマ定義・操作）
- **Zod**（入力バリデーション）
- **Server Actions**（フォーム送信処理）
- **API Routes（`route.ts`）**（fetch処理でのCRUD対応）