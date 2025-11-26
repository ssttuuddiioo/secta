'use client'

import { useState } from 'react'

export function VideoUploader() {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    // Validate file size (e.g., max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedUrl(data.url)
      
      // Copy URL to clipboard
      await navigator.clipboard.writeText(data.url)
      alert(`Video uploaded! URL copied to clipboard:\n${data.url}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 max-w-md">
      <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Upload Video to Vercel Blob</h2>
      
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm text-white/70 mb-2 block">Select MP4 file:</span>
          <input
            type="file"
            accept="video/mp4,video/*"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-white/70
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-secta-orange file:text-white
              hover:file:bg-secta-orange/80
              file:cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>

        {uploading && (
          <div className="text-secta-orange text-sm">Uploading...</div>
        )}

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        {uploadedUrl && (
          <div className="space-y-2">
            <div className="text-green-400 text-sm font-mono break-all">
              ✓ Uploaded!
            </div>
            <div className="text-xs text-white/50 font-mono break-all p-2 bg-white/5 rounded">
              {uploadedUrl}
            </div>
            <p className="text-xs text-white/50">
              URL copied to clipboard. Paste it in your videoUrl config.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}



