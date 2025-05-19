import { NextRequest, NextResponse } from 'next/server'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegPath || '')

export const config = {
  api: {
    bodyParser: false,
  },
}

const publicDir = path.join(process.cwd(), 'public')
const videoDir = path.join(publicDir, 'videos')
const subtitleDir = path.join(publicDir, 'subtitles')
const thumbnailDir = path.join(publicDir, 'thumbnails')
const trackFile = path.join(publicDir, 'video_track.json')

function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true, uploadDir: '/tmp' })

    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

function copyFile(source: string, target: string) {
  fs.copyFileSync(source, target)
}

function generateThumbnail(videoPath: string, thumbPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => resolve())
      .on('error', reject)
      .screenshots({ timestamps: ['0'], filename: path.basename(thumbPath), folder: path.dirname(thumbPath), size: '320x?' })
  })
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req)
    const title = fields.title?.[0]
    if (!title || !files.video?.[0]) return NextResponse.json({ error: 'Missing title or video file' }, { status: 400 })

    const id = uuidv4()
    const videoFile = files.video[0]
    const subtitleFile = files.subtitle?.[0]
    const thumbnailFile = files.thumbnail?.[0]

    // Ensure dirs
    ensureDir(videoDir)
    ensureDir(subtitleDir)
    ensureDir(thumbnailDir)

    // Copy video
    const videoExt = path.extname(videoFile.originalFilename || '')
    const videoDest = path.join(videoDir, `${id}${videoExt}`)
    copyFile(videoFile.filepath, videoDest)

    // Copy subtitle (if any)
    let subtitleDest = null
    if (subtitleFile) {
      const subExt = path.extname(subtitleFile.originalFilename || '')
      subtitleDest = path.join(subtitleDir, `${id}${subExt}`)
      copyFile(subtitleFile.filepath, subtitleDest)
    }

    // Thumbnail
    const thumbDest = path.join(thumbnailDir, `${id}.jpg`)
    if (thumbnailFile) {
      copyFile(thumbnailFile.filepath, thumbDest)
    } else {
      await generateThumbnail(videoDest, thumbDest)
    }

    // Track info
    const newVideo = {
      id,
      title,
      video: `/videos/${id}${videoExt}`,
      subtitle: subtitleDest ? `/subtitles/${path.basename(subtitleDest)}` : null,
      thumbnail: `/thumbnails/${id}.jpg`,
      upload_time: new Date().toISOString(),
    }

    const current = fs.existsSync(trackFile)
      ? JSON.parse(fs.readFileSync(trackFile, 'utf-8'))
      : []

    current.push(newVideo)
    current.sort((a: any, b: any) => new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime())

    fs.writeFileSync(trackFile, JSON.stringify(current, null, 2))
    return NextResponse.json({ success: true, video: newVideo })

  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
