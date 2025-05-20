import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPath = path.join(process.cwd(), 'public', 'videos');
    await mkdir(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: `/videos/${file.name}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
