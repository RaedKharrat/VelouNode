import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export default function (imageFieldName, sizeLimits) {
  return multer({
    storage: diskStorage({
      destination: (req, file, callback) => {
        try {
          const __dirname = dirname(fileURLToPath(import.meta.url));
          callback(null, join(__dirname, "../images"));
        } catch (error) {
          callback(error);
        }
      },
      filename: (req, file, callback) => {
        try {
          const name = file.originalname.split(" ").join("_");
          const extension = MIME_TYPES[file.mimetype];
          callback(null, `${name}${Date.now()}.${extension}`);
        } catch (error) {
          callback(error);
        }
      },
    }),
    limits: sizeLimits,
  }).single(imageFieldName);
}
