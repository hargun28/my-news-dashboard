"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { VALID_SLUGS, CATEGORY_MAP } from "@/lib/categories";

interface FormContainerProps {
  type: "create" | "delete";
  id?: string;
}

export default function FormContainer({ type, id }: FormContainerProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const router = useRouter();

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/news-articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!id) return;
    await fetch(`/api/news-articles/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const categories = VALID_SLUGS.map((slug) => ({ slug, title: CATEGORY_MAP[slug] || slug }));

  if (type === "create") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New Article
        </button>
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <form
              onSubmit={handleCreate}
              className="bg-white p-6 rounded space-y-4 w-full max-w-md"
            >
              <h2 className="text-lg font-semibold">Create Article</h2>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full border px-3 py-2"
              />
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Summary"
                className="w-full border px-3 py-2"
              />
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border px-3 py-2"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => {
        if (confirm("Delete this article?")) handleDelete();
      }}
      className="px-2 py-1 text-sm text-red-600"
    >
      Delete
    </button>
  );
}