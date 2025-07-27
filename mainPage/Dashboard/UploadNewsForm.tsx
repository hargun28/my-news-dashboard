'use client'

import { Input } from "@/components/base/input/input"
import { TextArea } from "@/components/base/textarea/textarea"
import { Button } from "@/components/base/buttons/button"
import { useState } from "react"
import { VALID_SLUGS, CATEGORY_MAP } from "@/lib/categories"
import { useRouter } from "next/navigation"

export default function UploadNewsForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", content)
    formData.append("category", category)
    if (imageFile) {
      formData.append("image", imageFile)
    }

    const res = await fetch("/api/articles", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      setError("Failed to post article")
    } else {
      setTitle("")
      setContent("")
      setCategory("")
      setImageFile(null)
      router.refresh()
    }  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg shadow flex flex-col gap-4 text-slate-100">
      <Input
        placeholder="Title"
        value={title}
        onChange={setTitle} // ✅ Untitled UI Input expects (value: string)
      />
      <TextArea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)} // ✅ HTML standard
      />
        <select
        className="rounded bg-slate-700 p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        {VALID_SLUGS.map((s) => (
          <option key={s} value={s}>
            {CATEGORY_MAP[s] || s}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="text-sm text-slate-100"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit">Post News</Button>
    </form>
  )
}
