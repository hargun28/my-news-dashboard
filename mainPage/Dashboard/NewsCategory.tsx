// components/dashboard/NewsCategoryNav.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Technology", slug: "technology", img: "/categories/technology.jpg" },
  { name: "Sports",     slug: "sports",     img: "/categories/sports.jpg"     },
  { name: "Business",   slug: "business",   img: "/categories/business.jpg"   },
  { name: "General",   slug: "politics",   img: "/categories/politics.jpg"   },
];

export default function NewsCategory() {
  return (
    <section aria-labelledby="category-heading" className="mt-6">
      <h2 id="category-heading" className="sr-only">News categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {categories.map(({ name, slug, img }) => (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-sm ring-1 ring-border hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
            aria-label={`Go to ${name} news`}
          >
            <Image
              src={img}
              alt={name}
              priority
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            {/* Label */}
            <span className="absolute bottom-3 left-3 text-white text-lg font-semibold drop-shadow">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
