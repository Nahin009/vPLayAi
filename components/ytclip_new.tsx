"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Props = {
  url: string; // full YouTube URL (e.g. https://www.youtube.com/watch?v=M7lc1UVf-VE)
};

export default function YouTubeClipPlayer({ url }: Props) {
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClipped, setIsClipped] = useState(false);
  const [clipTrigger, setClipTrigger] = useState(0); // force re-trigger
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(0);
  const [queryText, setQueryText] = useState("");

  const videoIdFromUrl = (ytUrl: string) => {
    const match = ytUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  const timeStringToSeconds = (timeStr: string) => {
    const [hms, ms = "0"] = timeStr.split(",");
    const parts = hms.split(":").map(Number);
    const seconds = parts.reduce((acc, val) => acc * 60 + val, 0);
    return seconds + parseInt(ms) / 1000;
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      const id = videoIdFromUrl(url);
      playerRef.current = new YT.Player("ytplayer", {
        videoId: id,
        playerVars: { enablejsapi: 1, controls: 1 },
        events: {
          onReady: () => {
            const player = playerRef.current;
            if (!player) return;

            const dur = player.getDuration();
            setDuration(dur);

            player.playVideo();
          },
        },
      });
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [url]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isClipped) {
      player.seekTo(clipStart, true);
      player.playVideo();
      setCurrentTime(clipStart);

      intervalRef.current = setInterval(() => {
        const time = player.getCurrentTime();
        setCurrentTime(time);
        if (time > clipEnd + 1 || time < clipStart) {
          player.seekTo(clipStart, true);
        }
      }, 300);
    } else {
      player.seekTo(0, true);
      player.playVideo();
      setCurrentTime(0);
    }
  }, [isClipped, clipTrigger, clipStart, clipEnd]);

  const percent = (val: number) =>
    duration && !isNaN(duration) ? (val / duration) * 100 : 0;

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:9005/get-segment-times/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText }),
    });

    const { start_time, end_time } = await response.json();
    setClipStart(timeStringToSeconds(start_time));
    setClipEnd(timeStringToSeconds(end_time));
    setIsClipped(true);
    setClipTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex gap-16">
      <div className="w-2/3 mb-4 flex flex-col gap-2">
        <div id="ytplayer" className="aspect-video rounded-4xl w-full h-full" />

        {isClipped && duration > 0 && (
          <div className="relative h-4 bg-gray-200 rounded shadow-inner">
            <div
              className="absolute top-0 h-full bg-blue-500/60"
              style={{
                left: `${percent(clipStart)}%`,
                width: `${percent(clipEnd - clipStart)}%`,
              }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-black"
              style={{ left: `${percent(currentTime)}%` }}
            />
          </div>
        )}
        {isClipped && (
          <Button className="" onClick={() => setIsClipped(false)}>
            Reset
          </Button>
        )}
      </div>

      <div className="w-1/3 p-6 flex flex-col gap-6">
        <h1 className="text-2xl">Provide a Query</h1>
        <Textarea
          className="w-full h-52"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit Query</Button>
      </div>
    </div>
  );
}
