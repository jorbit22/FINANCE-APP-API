import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error); // Log upload errors
                    reject(error);
                } else {
                    console.log('Cloudinary upload result:', result); // Log upload result
                    if (result && result.url) {
                        resolve(result.url);
                    } else {
                        reject(new Error('Cloudinary upload result does not contain a URL'));
                    }
                }
            });
            if (file.buffer) {
                stream.end(file.buffer);
            } else {
                reject(new Error('File buffer is missing'));
            }
        });
    }
}
