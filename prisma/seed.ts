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
 async function makeArticle({
    authorId,
    orgId,
    title,
    description,
    category,
    imageUrl,
  }: {
    authorId: string;
    orgId: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
  }) {
      return prisma.newsArticle.create({
      data: {
        title,
        description,
        content: description,
        views: Math.floor(Math.random() * 500), // random 0-499
        category,
        imageUrl,
        authorId,
        organizationId: orgId,
      },
    });
  }

  await Promise.all([
    makeArticle({
      authorId: reporter1.id,
      orgId: orgA.id,
      title: "Tech Trends Shaping 2025",
      description: "A quick look at upcoming tech innovations for next year.",
      category: "technology",
      imageUrl: "https://source.unsplash.com/800x600/?technology",
    }),
    makeArticle({
      authorId: reporter1.id,
      orgId: orgA.id,
      title: "Local Team Wins Championship",
      description: "Exciting final match leads to a stunning victory.",
      category: "sports",
      imageUrl: "https://source.unsplash.com/800x600/?sports",
    }),
    makeArticle({
      authorId: reporter2.id,
      orgId: orgB.id,
      title: "Market Update: Stocks Rally",
      description: "Investors show renewed optimism across the board.",
      category: "business",
      imageUrl: "https://source.unsplash.com/800x600/?business",
    }),
    makeArticle({
      authorId: reporter2.id,
      orgId: orgB.id,
      title: "Election Season Heats Up",
      description: "Parties gear up for a close race this fall.",
      category: "politics",
      imageUrl: "https://source.unsplash.com/800x600/?politics",
    }),
    makeArticle({
      authorId: reporter3.id,
      orgId: orgA.id,
      title: "New Gadget Review Roundup",
      description: "We test the latest devices so you don't have to.",
      category: "technology",
      imageUrl: "https://source.unsplash.com/800x600/?gadget",
    }),
    makeArticle({
      authorId: reporter4.id,
      orgId: orgA.id,
      title: "High School Championship Preview",
      description: "Teams prepare for the big showdown.",
      category: "sports",
      imageUrl: "https://source.unsplash.com/800x600/?stadium",
    }),
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
