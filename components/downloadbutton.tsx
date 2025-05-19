'use client';

import { useState, useTransition } from 'react';
import { downloadVideoToServer } from '@/server_actions/download_video';
import Image from 'next/image';

export default function DownloadButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const handleClick = () => {
    setMessage('');
    startTransition(() => {
      downloadVideoToServer()
        .then((res: any) => {
          setMessage(res.message);
          if (res.success) {
            setVideoUrl(res.videoUrl);
            setThumbnailUrl(res.thumbnailUrl);
          }
        })
        .catch((err: any) => {
          setMessage(err.message || 'Something went wrong');
        });
    });
  };

  return (
    <div className="p-4 border rounded-md max-w-md space-y-4">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isPending ? 'Downloading...' : 'Download Video & Thumbnail'}
      </button>

      {message && <p>{message}</p>}

      {thumbnailUrl && (
        <div>
          <p className="mt-2 font-semibold">Thumbnail:</p>
          <Image width={400} height={200} src={thumbnailUrl} alt="Thumbnail" className="w-full border rounded" />
        </div>
      )}

      {videoUrl && (
        <video width="100%" height="auto" controls className="mt-4">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
