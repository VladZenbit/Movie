import { randomUUID } from 'crypto';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  async uploadFile(
    file: Express.Multer.File,
    url: string,
  ): Promise<{ key: string }> {
    try {
      const s3 = new S3({
        sslEnabled: true,
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      });

      const key = randomUUID();

      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME'),
          Body: file.buffer,
          Key: `${url}/${key}-${file.originalname}`,
          ContentType: 'image/jpeg',
        })
        .promise();

      return {
        key: uploadResult.Key,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      console.log(key);
      const s3 = new S3({
        sslEnabled: true,
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      });

      s3.deleteObject(
        {
          Bucket: this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME'),
          Key: key,
        },
        (err) => {
          if (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        },
      );

      return;
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
