'use client'
import { useState } from 'react'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [video, setVideo] = useState<File | null>(null)
  const [subtitle, setSubtitle] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!video || !title) return alert('Title and video are required')

    const form = new FormData()
    form.append('title', title)
    form.append('video', video)
    if (subtitle) form.append('subtitle', subtitle)
    if (thumbnail) form.append('thumbnail', thumbnail)

    setLoading(true)
    const res = await fetch('/api/uploadall', { method: 'POST', body: form })
    const data = await res.json()
    setLoading(false)

    if (res.ok) alert('Upload complete!')
    else alert(data.error || 'Failed')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input type="text" placeholder="Title" className="border p-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
      <input type="file" accept=".srt" onChange={(e) => setSubtitle(e.target.files?.[0] || null)} />
      <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">{loading ? 'Uploading...' : 'Upload Video'}</button>
    </form>
  )
}
