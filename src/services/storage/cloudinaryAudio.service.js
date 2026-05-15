import { v2 as cloudinary } from "cloudinary";

let configured = false;

const ensureCloudinaryConfig = () => {
  if (configured) {
    return;
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary configuration is incomplete.");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
};

class CloudinaryAudioService {
  static async uploadAudioFile({ filePath, userId, goalId, generationDate }) {
    ensureCloudinaryConfig();

    const date = generationDate
      ? new Date(generationDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    const folder = `motivations/${userId}/${goalId}`;
    const publicId = `${folder}/${date}`;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder,
      public_id: publicId,
      overwrite: true,
      format: "mp3",
    });

    return {
      cloudinaryPublicId: result.public_id,
      audioUrl: result.secure_url,
      duration: result.duration || null,
      format: result.format || "mp3",
      bytes: result.bytes || null,
    };
  }
}

export default CloudinaryAudioService;
