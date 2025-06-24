'use client'

import { useEffect, useRef, useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

type Props = {
  url: string // full YouTube URL (e.g. https://www.youtube.com/watch?v=M7lc1UVf-VE)
  start: string // formatted as hh:mm:ss or mm:ss
  end: string
}

export default function YouTubeClipPlayer({ url, start, end }: Props) {
  const playerRef = useRef<YT.Player | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const toSeconds = (t: string) =>
    t.split(':').reduce((acc, val, i, arr) => acc + parseInt(val) * Math.pow(60, arr.length - i - 1), 0)

  const startTime = toSeconds(start)
  const endTime = toSeconds(end)

  const videoIdFromUrl = (ytUrl: string) => {
    const match = ytUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : ''
  }

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      const id = videoIdFromUrl(url)

      playerRef.current = new YT.Player('ytplayer', {
        videoId: id,
        playerVars: { enablejsapi: 1 },
        events: {
            onReady: () => {
                const player = playerRef.current;
                if (!player) return;
              
                const dur = player.getDuration();
                setDuration(dur);
              
                player.seekTo(startTime, true);
                player.playVideo();
              
                if (intervalRef.current) clearInterval(intervalRef.current);
              
                intervalRef.current = setInterval(() => {
                  const time = player.getCurrentTime();
                  setCurrentTime(time);
              
                  if (time >= endTime) {
                    player.seekTo(startTime, true);
                  }
                }, 300);
              }              
        },
      })
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [url, startTime, endTime])



  const percent = (val: number) =>
    duration && !isNaN(duration) ? (val / duration) * 100 : 0

  return (
    <div className="flex gap-16">
      <div className="w-2/3 mb-4">
        <div id="ytplayer" className=" aspect-video rounded-4xl w-full h-full" />

        {duration > 0 && (
          <div className="relative h-4 bg-gray-200 rounded shadow-inner">
            <div
              className="absolute top-0 h-full bg-blue-500/60"
              style={{
                left: `${percent(startTime)}%`,
                width: `${percent(endTime - startTime)}%`,
              }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-black"
              style={{ left: `${percent(currentTime)}%` }}
            />
          </div>
        )}
      </div>
      <div className="w-1/3 p-6 flex flex-col gap-6">
        <h1 className=' text-2xl'>Provide a Query</h1>
        <Textarea className='w-full h-52'></Textarea>
        <Button className='cursor-pointer'>Submit Query</Button>
      </div>
    </div>
  )
}
