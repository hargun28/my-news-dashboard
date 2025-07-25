// scripts/export‑users.ts
import fs from "fs";
import path from "path";
import prisma from "../lib/prisma";

async function main() {
  // Select only the fields Clerk needs
  const users = await prisma.user.findMany({
    select: {
      id: true,             // we'll use this as externalId
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      // You can also export metadata for roles/orgs:
      organizationId: true,
      role: true,
    },
  });

  // Map into Clerk’s import format
  const clerkUsers = users.map((u) => ({
    externalId: u.id,             // preserve your own ID
    emailAddresses: [
      { emailAddress: u.email!, verified: true },
    ],
    firstName: u.username,        // or split username, etc.
    unsafeMetadata: {
      role: u.role,
      organizationId: u.organizationId,
    },
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  fs.writeFileSync(
    path.resolve(__dirname, "../users-to-import.json"),
    JSON.stringify(clerkUsers, null, 2)
  );
  console.log(`Exported ${clerkUsers.length} users`);
}

main().catch(console.error);
