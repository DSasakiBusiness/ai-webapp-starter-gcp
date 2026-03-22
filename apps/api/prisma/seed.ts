import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータの投入を開始...');

  // 管理者ユーザー
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理者',
      password: '$2b$10$placeholder-hash-replace-with-real-hash',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ 管理者ユーザー: ${admin.email}`);

  // テストユーザー
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'テストユーザー',
      password: '$2b$10$placeholder-hash-replace-with-real-hash',
      role: Role.USER,
    },
  });
  console.log(`✅ テストユーザー: ${user.email}`);

  // サンプル会話
  const conversation = await prisma.conversation.create({
    data: {
      title: 'サンプル会話',
      userId: user.id,
      messages: {
        create: [
          {
            role: 'USER',
            content: 'こんにちは、AI アシスタントさん。',
          },
          {
            role: 'ASSISTANT',
            content:
              'こんにちは！お手伝いできることがあれば、お気軽にお聞きください。',
          },
        ],
      },
    },
  });
  console.log(`✅ サンプル会話: ${conversation.title}`);

  console.log('🌱 シードデータの投入が完了しました');
}

main()
  .catch((e) => {
    console.error('❌ シード処理中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
