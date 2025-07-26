'use client'

import { Input } from "@/components/base/input/input"
import { TextArea } from "@/components/base/textarea/textarea"
import { Button } from "@/components/base/buttons/button"
import { useState } from "react"

export default function UploadNewsForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Submitted: " + title + "\n" + content)
  }

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
      <Button type="submit">Post News</Button>
    </form>
  )
}
