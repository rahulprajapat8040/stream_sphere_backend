import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as fs from 'fs';
import { Request } from 'express';
import * as ffmpeg from 'fluent-ffmpeg'


interface MulterRequest extends Request {
    files: Express.Multer.File[];
}


@Injectable()
export class FileService {
    async uploadFile(req: MulterRequest, folder = '/'): Promise<{ file: any[]; body: any }> {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const path = `uploads/${folder}`;
                fs.mkdirSync(path, { recursive: true });
                cb(null, path);
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
            },
        });

        const upload = multer({ storage }).any();

        return new Promise((resolve, reject) => {
            upload(req, {} as any, async (err) => {
                if (err) return reject(err);

                try {
                    const files = req.files && req.files.length > 0
                        ? req.files.map((file) => ({
                            ...file,
                            originalPath: file.path,
                            path: `${process.env.MULTER}${file.path.replace(/\\/g, '/')}`,
                        }))
                        : [];

                    for (const file of files) {
                        const ext = file.path.split('.').pop()?.toLowerCase();
                        const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '');
                        if (isVideo) {
                            console.log('file path', file.originalPath)
                            await this.genrateResolutions(file.originalPath);
                        } else {
                            console.log(`Skipping resolution generation for non-video file: ${file.originalname}`);
                        }
                    }
                    resolve({ body: req.body, file: files });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async removeFile(files: any): Promise<void> {
        if (!files) {
            console.error('No files provided for deletion.');
            return;
        }
        try {
            if (Array.isArray(files)) {
                files.forEach((file) => {
                    const path = file.path ? file.path.replace(process.env.MULTER, '') : file.replace(process.env.MULTER, '');
                    fs.unlinkSync(path);
                    console.log('Files Deleted');
                });
            } else {
                const path = files.path ? files.path.replace(process.env.MULTER, '') : files.replace(process.env.MULTER, '');
                fs.unlinkSync(path);
                console.log('File Deleted');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    private async genrateResolutions(filePath: string): Promise<void> {
        const resolutions = [
            { name: '144p', size: '256x144' },
            { name: '360p', size: '640x360' },
            { name: '480p', size: '854x480' },
            { name: '720p', size: '1280x720' },
            { name: '1080p', size: '1920x1080' },
        ];

        const ext = filePath.split('.').pop();
        const fileName = filePath.split('/').pop()?.split('.')[0]

        for (const res of resolutions) {
            const outPutDir = filePath.replace(/\/[^\/]+$/, `/${res.name}`);
            fs.mkdirSync(outPutDir, { recursive: true });

            const outputPath = `${outPutDir}/${fileName}_${res.name}.m3u8`
            const segmentPattern = `${outPutDir}/${fileName}_${res.name}_%03d.ts`;

            await new Promise((resolve, reject) => {
                ffmpeg(filePath).outputOption([
                    '-profile:v baseline', // HLS compatibility
                    '-level 3.0',
                    '-start_number 0',
                    '-hls_time 10', // 10-second segments
                    '-hls_list_size 0', // Include all segments
                    '-f hls',
                    '-loglevel quiet' // Suppress the verbose log output

                ]).size(res.size).output(outputPath)
                    .on('end', () => {
                        console.log(`Hls ${res.name} created at ${outputPath}`);
                        resolve(true)
                    }).on('error', (err) => {
                        console.log(`Hls error for ${res.name}`, err.message)
                        reject(err)
                    })
                    .run()
            })
        }
    }
}
