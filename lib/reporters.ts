// lib/reporters.ts
import prisma from "@/lib/prisma";
import type { NewsArticle, User } from "@prisma/client";

export type ReporterStats = User & {
  _count: { followers: number; articles: number };
  organization: { id: string; name: string } | null;
};

export type ReporterSearchResult = {
  id: string;
  name: string;
  avatarUrl?: string | null; // add field if you store it
  organization?: { id: string; name: string } | null;
  isFollowed: boolean;
};

/**
 * All articles written by users the current user follows.
 */
export async function getFollowedArticles(userId: string): Promise<NewsArticle[]> {
  if (!userId) return [];
  return prisma.newsArticle.findMany({
    where: {
      author: {
        followers: {
          some: { followerId: userId }, // I follow them
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Reporter details + counts.
 * Reporter is a User with role = REPORTER.
 */
export async function getReporterById(id: string): Promise<ReporterStats | null> {
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    include: {
      organization: { select: { id: true, name: true } },
      _count: {
        select: {
          followers: true, // users who follow ME
          articles: true,
        },
      },
    },
  }) as Promise<ReporterStats | null>;
}

/**
 * Articles by a specific reporter (User).
 */
export async function getArticlesByReporter(
  reporterId: string,
  skip = 0,
  take = 10,
): Promise<NewsArticle[]> {
      if (!reporterId) return [];
      return prisma.newsArticle.findMany({
        where: { authorId: reporterId },
        orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}

export async function listReporters(
  skip = 0,
  take = 10,
  currentUserId?: string,
): Promise<ReporterSearchResult[]> {
  const reporters = await prisma.user.findMany({
    where: { role: "REPORTER" },
    include: {
      organization: { select: { id: true, name: true } },
      ...(currentUserId && {
        followers: {
          where: { followerId: currentUserId },
          select: { followerId: true },
        },
      }),
    },
    skip,
    take,
    orderBy: { username: "asc" },
  });
  return reporters.map<ReporterSearchResult>((u) => ({
    id: u.id,
    name: u.username ?? "Unnamed Reporter",
    avatarUrl: (u as any).avatarUrl,
    organization: u.organization,
    isFollowed: currentUserId ? (u as any).followers?.length > 0 : false,
  }));
}

/**
 * Search reporters by name (role = REPORTER) and flag which are already followed by current user.
 */
export async function searchReporters(
  query: string,
  currentUserId?: string,
  take = 15
): Promise<ReporterSearchResult[]> {
  const reporters = await prisma.user.findMany({
    where: {
      role: "REPORTER",
      username: { contains: query, mode: "insensitive" },
    },
    include: {
      organization: { select: { id: true, name: true } },
      ...(currentUserId && {
        followers: { where: { followerId: currentUserId }, select: { followerId: true } },
      }),
    },
    take,
  });

  return reporters.map<ReporterSearchResult>((u) => ({
    id: u.id,
    name: u.username ?? u.username ?? "Unnamed Reporter",
    avatarUrl: (u as any).avatarUrl, // remove if you don't have this field
    organization: u.organization,
    isFollowed: currentUserId ? (u as any).followers?.length > 0 : false,
  }));
}
