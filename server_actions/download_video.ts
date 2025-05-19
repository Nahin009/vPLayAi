'use server';

import fs from 'fs';
import path from 'path';
import https from 'https';
import { exec } from 'child_process';
import { promisify } from 'util';
import { randomInt } from 'crypto';

const execAsync = promisify(exec);

export async function downloadVideoToServer() {
//   const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
    // const videoUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
    // const videoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'

  const random_int = Math.floor(Math.random() * 1000);

  const fileName = 'test' + random_int + '.mp4';
  const thumbnailName = 'test' + random_int + '.jpg';

  const videoDir = path.join(process.cwd(), 'public', 'videos');
  const thumbDir = path.join(process.cwd(), 'public', 'thumbnails');

  const videoPath = path.join(videoDir, fileName);
  const thumbnailPath = path.join(thumbDir, thumbnailName);

  // If thumbnail already exists, assume video was already downloaded
  if (fs.existsSync(thumbnailPath)) {
    return {
      success: true,
      message: 'Video and thumbnail already exist.',
      videoUrl: `/videos/${fileName}`,
      thumbnailUrl: `/thumbnails/${thumbnailName}`,
    };
  }

  // Ensure directories exist
  fs.mkdirSync(videoDir, { recursive: true });
  fs.mkdirSync(thumbDir, { recursive: true });

  // Download video
  await new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(videoPath);
    https
      .get(videoUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download video: status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlinkSync(videoPath);
        reject(err);
      });
  });

  // Generate thumbnail using ffmpeg
  try {
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01.000 -vframes 1 "${thumbnailPath}"`;
    await execAsync(command);
  } catch (err) {
    throw new Error('Failed to generate thumbnail: ' + (err as any).message);
  }

  return {
    success: true,
    message: 'Video and thumbnail downloaded successfully.',
    videoUrl: `/videos/${fileName}`,
    thumbnailUrl: `/thumbnails/${thumbnailName}`,
  };
}
