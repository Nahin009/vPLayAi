import { writeFile, mkdir, rename, readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const PUBLIC_PATH = path.join(process.cwd(), 'public');
const VIDEO_DIR = path.join(PUBLIC_PATH, 'videos');
const SUBTITLE_DIR = path.join(PUBLIC_PATH, 'subtitles');
const THUMBNAIL_DIR = path.join(PUBLIC_PATH, 'thumbnails');
const DATA_FILE = path.join(process.cwd(), 'db', 'video_track.json');

async function ensureDirectories() {
  await Promise.all([
    mkdir(VIDEO_DIR, { recursive: true }),
    mkdir(SUBTITLE_DIR, { recursive: true }),
    mkdir(THUMBNAIL_DIR, { recursive: true }),
  ]);
}

function parseForm(req: NextRequest) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {

    console.log('POST request received');
  await ensureDirectories();
//   const { fields, files }: any = await parseForm(req);
  const uuid = uuidv4();

//     console.log('Parsed fields:', fields);

//   const title = fields.title?.[0] || 'Untitled';

//   const videoFile = files.video?.[0];
//   const subtitleFile = files.subtitle?.[0];
//   const thumbnailFile = files.thumbnail?.[0];

    const formData = await req.formData();
    const videoFile = formData.get('video') as File;
    const title = formData.get('title') as string;
    const subtitleFile = formData.get('subtitle') as File;
    const thumbnailFile = formData.get('thumbnail') as File;

  console.log('got files:');
  console.log('title:', title);

//   const videoExt = path.extname(videoFile.name);
//   const subtitleExt = subtitleFile ? path.extname(subtitleFile.name) : '';
//   const thumbnailExt = thumbnailFile ? path.extname(thumbnailFile.name) : '';

//   const videoDest = path.join(VIDEO_DIR, `${uuid}${videoExt}`);
//   const subtitleDest = subtitleFile ? path.join(SUBTITLE_DIR, `${uuid}${subtitleExt}`) : '';
//   const thumbnailDest = thumbnailFile ? path.join(THUMBNAIL_DIR, `${uuid}${thumbnailExt}`) : '';

//     console.log('Video destination:', videoDest);

//   await rename(videoFile.filepath, videoDest);
//   if (subtitleFile) await rename(subtitleFile.filepath, subtitleDest);
//   if (thumbnailFile) await rename(thumbnailFile.filepath, thumbnailDest);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPath = path.join(process.cwd(), 'public', 'videos');
    await mkdir(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, file.name);
    await writeFile(filePath, buffer);

    console.log('Files moved successfully');

  let db = [];
  if (fs.existsSync(DATA_FILE)) {
    db = JSON.parse(await readFile(DATA_FILE, 'utf-8'));
  }

  console.log('DB:', db);

  db.push({
    id: uuid,
    title,
    video: `/videos/${uuid}${videoExt}`,
    subtitle: subtitleFile ? `/subtitles/${uuid}${subtitleExt}` : null,
    thumbnail: thumbnailFile ? `/thumbnails/${uuid}${thumbnailExt}` : null,
  });

    console.log('DB after push:', db);

  await writeFile(DATA_FILE, JSON.stringify(db, null, 2));

  return NextResponse.json({ success: true, id: uuid });
}
