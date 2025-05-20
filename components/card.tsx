import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'

function card() {
  return (
    <div>
      <Link href={"/showSingleVideo"}>
                        <div className="relative flex flex-row border-0 rounded-r-lg rounded-l-xs overflow-hidden shadow hover:shadow-2xl transition dark:shadow dark:shadow-gray-800 dark:hover:shadow-2xl group">
                            {/* Thumbnail Image */}
                           <div className="relative w-1/2 overflow-hidden">
                             <Image
                                src="/thumbnails/srbd_dp.jpg"
                                alt={"hellu"}
                                width={80}
                                height={160}
                                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                            />

                            {/* Video Duration (Bottom Right) */}
                            <div className="absolute bottom-2 right-2 bg-black opacity-80 text-white text-sm px-2 py-1 rounded group-hover:invisible">
                                60:00
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black opacity-50 rounded-full p-4 transition-opacity duration-300 group-hover:opacity-100">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                           </div>



                            {/* Title and button */}
                            <div className=" p-6 w-1/2 bg-blue-50 group-hover:bg-amber-50 dark:bg-gray-900 group-hover:dark:bg-black">
                                    <h1 className="text-lg font-semibold text-wrap">Video Title Video Title Video Title</h1>
                                    <p className=" opacity-50 text-xs italic"> 11/12/2025 </p>
                            </div>

                        </div>
                    </Link>
    </div>
  )
}

export default card
