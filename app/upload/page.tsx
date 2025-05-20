'use client'

import { useState } from 'react';

export default function UploadVideo() {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const fileInput = e.currentTarget.elements.namedItem('video') as HTMLInputElement;

    if (!fileInput?.files?.length) {
      setError('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json(); // will throw if not valid JSON

      if (data.success) {
        setVideoUrl(data.url);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('Upload failed: ' + (err as Error).message);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" name="video" accept="video/*" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {videoUrl && (
        <video className="mt-4" controls width="400">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
