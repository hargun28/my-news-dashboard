// components/dashboard/NewsCategoryNav.tsx
import Link from "next/link"

const categories = ["Technology", "Sports", "Business", "Politics"]

export default function NewsCategoryNav() {
  return (
    <div className="flex gap-4 mt-4">
      {categories.map(category => (
        <Link key={category} href={`/category/${category.toLowerCase()}`} className="text-blue-600 hover:underline text-sm">
          {category}
        </Link>
      ))}
    </div>
  )
}
