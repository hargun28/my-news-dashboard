// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Organizations
  const orgA = await prisma.organization.create({
    data: {
      name: "BSML News Agency",
      slug: "bsml",
    },
  });

  const orgB = await prisma.organization.create({
    data: {
      name: "Globex Media",
      slug: "globex",
    },
  });

  // Helper to make a user
  async function makeUser({
    username,
    email,
    role,
    orgId,
  }: {
    username: string;
    email?: string;
    role: Role;
    orgId?: string | null;
  }) {
    return prisma.user.create({
      data: {
        username,
        email: email ?? `${username}@example.com`,
        role,
        organizationId: orgId ?? null,
        // clerkId: "replace-if-you-have-it"
      },
    });
  }

  // 2) Users
  const reporter1 = await makeUser({ username: "rep_alex", role: Role.REPORTER, orgId: orgA.id });
  const reporter2 = await makeUser({ username: "rep_bob",  role: Role.REPORTER, orgId: orgB.id });
  const reporter3 = await makeUser({ username: "rep_cara", role: Role.REPORTER, orgId: orgA.id });
  const reporter4 = await makeUser({ username: "rep_dan", role: Role.REPORTER, orgId: orgA.id });

  const reader1  = await makeUser({ username: "reader_jane", role: Role.READER });
  const reader2  = await makeUser({ username: "reader_mike", role: Role.READER });
  const reader3  = await makeUser({ username: "reader_sara", role: Role.READER });
  const reader4 = await makeUser({ username: "reader_emma", role: Role.READER });
  const reader5 = await makeUser({ username: "reader_nick", role: Role.READER });
  // 3) News Articles (attach org same as author)
  async function makeArticle(authorId: string, orgId: string, i: number) {
    return prisma.newsArticle.create({
      data: {
        title: `Sample Article ${i}`,
        description: `This is the body of sample article ${i}.`,
        views: Math.floor(Math.random() * 500), // random 0-499
        authorId,
        organizationId: orgId,
      },
    });
  }

  await Promise.all([
    makeArticle(reporter1.id, orgA.id, 1),
    makeArticle(reporter1.id, orgA.id, 2),
    makeArticle(reporter2.id, orgB.id, 3),
    makeArticle(reporter2.id, orgB.id, 4),
    makeArticle(reporter3.id, orgA.id, 5),
    makeArticle(reporter4.id, orgA.id, 6),
  ]);

  // 4) Follow relationships
  // readers follow reporters
  await prisma.follow.createMany({
    data: [
      { followerId: reader1.id, followingId: reporter1.id },
      { followerId: reader1.id, followingId: reporter3.id },
      { followerId: reader2.id, followingId: reporter1.id },
      { followerId: reader2.id, followingId: reporter4.id },
      { followerId: reader3.id, followingId: reporter2.id },
      { followerId: reader4.id, followingId: reporter3.id },
      { followerId: reader5.id, followingId: reporter2.id },
    ],
    skipDuplicates: true,
  });

  // reporters can follow reporters too (example)
  await prisma.follow.create({
    data: { followerId: reporter1.id, followingId: reporter2.id },
  });

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
