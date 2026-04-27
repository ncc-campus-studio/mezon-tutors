import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { AppConfigService } from '../../shared/services/app-config.service';

type UploadOptions = {
  folder?: string;
  publicId?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
};

@Injectable()
export class CloudinaryService {
  constructor(private readonly appConfig: AppConfigService) {
    const config = this.appConfig.cloudinaryConfig;
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });
  }

  private ensureConfigured() {
    const c = this.appConfig.cloudinaryConfig;
    if (!c.cloudName?.trim() || !c.apiKey?.trim() || !c.apiSecret?.trim()) {
      throw new ServiceUnavailableException(
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the API environment.'
      );
    }
  }

  async uploadFile(buffer: Buffer, options?: UploadOptions) {
    this.ensureConfigured();
    if (!buffer?.length) {
      throw new BadRequestException('File buffer is empty');
    }

    return new Promise<{
      publicId: string;
      secureUrl: string;
      url: string;
      resourceType: string;
      bytes: number;
      format?: string;
      width?: number;
      height?: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder,
          public_id: options?.publicId,
          resource_type: options?.resourceType || 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new InternalServerErrorException(error.message || 'Upload to Cloudinary failed'));
            return;
          }

          if (!result) {
            reject(new InternalServerErrorException('Cloudinary did not return upload result'));
            return;
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            url: result.url,
            resourceType: result.resource_type,
            bytes: result.bytes,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
    this.ensureConfigured();
    if (!publicId?.trim()) {
      throw new BadRequestException('publicId is required');
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return {
      publicId,
      result: result.result,
    };
  }

  createUploadSignature(params: { folder?: string; publicId?: string; timestamp?: number }) {
    this.ensureConfigured();
    const timestamp = params.timestamp || Math.floor(Date.now() / 1000);
    const payload: Record<string, string | number> = {
      timestamp,
    };

    if (params.folder) payload.folder = params.folder;
    if (params.publicId) payload.public_id = params.publicId;

    const signature = cloudinary.utils.api_sign_request(
      payload,
      this.appConfig.cloudinaryConfig.apiSecret
    );

    return {
      cloudName: this.appConfig.cloudinaryConfig.cloudName,
      apiKey: this.appConfig.cloudinaryConfig.apiKey,
      timestamp,
      signature,
      folder: params.folder || null,
      publicId: params.publicId || null,
    };
  }
}
