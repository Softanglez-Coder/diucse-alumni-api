import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Multer } from 'multer';
import { Express } from 'express';
import * as path from 'path';

@Injectable()
export class UploadService {
    async saveFile(file: Express.Multer.File): Promise<string> {
        const uploadPath = path.join(__dirname, '..', 'uploads');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const filePath = path.join(uploadPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);

        return `File uploaded successfully: ${file.originalname}`;
    }
}