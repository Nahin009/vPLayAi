'use client'

import DownloadButton from '@/components/downloadbutton'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

export default function VideoClipper() {
  const videoRef = useRef<HTMLVideoElement>(null)
  // const progressRef = useRef<HTMLDivElement>(null)

  const [start, setStart] = useState(5)
  const [end, setEnd] = useState(10)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)


  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      if (video.currentTime >= end) {
        video.currentTime = start
      }
    }

    const onLoaded = () => {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', onLoaded)

    if (video.readyState >= 1) {
      setDuration(video.duration)
    }

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [start, end])

  const handleSubmit = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = start
      videoRef.current.play()
    }
  }

  const percent = (val: number) => {
    if (!duration || isNaN(duration) || duration === 0) return 0;
    return (val / duration) * 100;
  };
  

  return (
    <div className="p-4 max-w-xl mx-auto">
      <video ref={videoRef} width="100%" controls className="mb-4">
        <source src="videos/GotS04E03.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {duration > 0 && (
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-6">
        <div
          className="absolute top-0 h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-80"
          style={{
            left: `${percent(start)}%`,
            width: `${percent(end - start)}%`,
          }}
        />
        <div
          className="absolute top-0 h-full w-1.5 bg-red-500 rounded-full shadow-md"
          style={{ left: `${percent(currentTime)}%` }}
        />
      </div>
    )}

      <div className="flex gap-4 mb-4">
        <label>
          Start Time (sec):
          <input
            type="number"
            className="border ml-2 w-20"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
        </label>
        <label>
          End Time (sec):
          <input
            type="number"
            className="border ml-2 w-20"
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit}>
          Play Clip
        </Button>

        <DownloadButton />
      </div>
    </div>
  )
}
