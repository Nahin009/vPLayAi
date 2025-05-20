"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

export default function Video() {


  return (
    <div className="flex flex-row w-full p-8 gap-6">

        <div className="w-2/3 h-1/3 p-4">
            <video className="w-full" controls preload="auto"
            //  poster={`/asset/thumbnails/thumbnail${id}.jpg`}
            style={{objectFit : "cover"}}
            >
                <source src={`/videos/Big_Buck_Bunny_360_10s_1MB.mp4#t=0.1`} type="video/mp4" />
                <track
                src="/asset/videos/subtitle.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
                default
                />
                Your browser does not support the video tag.
            </video>

            <div className='flex flex-row justify-between p-4'>                             
                <div className="flex flex-col gap-2">
                    <h1 className=" text-5xl">Hello World</h1>
                    <p className="text-xs">Date Posted : 12/10/2025</p>
                </div>
                <div className='flex flex-row gap-2'>
                    <Button className="px-6">New Highlights</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="px-6">New Clip</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Generate Clip</DialogTitle>
                            <DialogDescription>
                                Enter your query. Ai will take you to that place
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Textarea placeholder="Type your query here..."></Textarea>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                </div>
            </div>

        
        </div>

        <div className="w-1/3">
                <div className="w-3/4  p-4 flex flex-col gap-4">
                    <div className="border-2 p-4 flex flex-col gap-4 bg-gray-100 dark:bg-gray-700">
                        <h1 className=" text-2xl">HighLights</h1>
                        <Card />
                        {/* <hr className=" border-black dark:border-amber-50" /> */}
                        {/* <div className="relative w-3/4">
                            <Button className=" absolute right-0 p-6">Generate Another</Button>
                        </div> */}
                    </div>

                    <ScrollArea className=" h-140 rounded-md border-2 shadow-lg bg-gray-100 dark:bg-gray-700 pb-6">
                        <div className="p-4">
                            <h1 className=" sticky top-0 z-10 text-2xl  bg-gray-100 dark:bg-gray-700 mb-2 py-2">Clips</h1>
                                {[1,2,3,4,5].map((key) => (
                                <div key={key}>
                                    <Card />
                                    <hr className="my-2 border-black dark:border-amber-50" />
                                </div>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
        </div>
    </div>
  )
}
