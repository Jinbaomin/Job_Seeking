import { diskStorage } from "multer";
import { extname } from "path";

function generateFilename(file) {
  return `${Date.now()}${extname(file.originalname)}`;
}

export const storage = diskStorage({
  destination: (req, file, callback) => {
    // Example: choose folder based on file fieldname
    let uploadPath = './public/images';

    // if (file.fieldname === 'avatar') {
    //   uploadPath = './public/avatars';
    // } else if (file.fieldname === 'document') {
    //   uploadPath = './public/docs';
    // }

    // Ensure the directory exists
    // fs.mkdirSync(uploadPath, { recursive: true });

    callback(null, uploadPath);
  }, // Directory where files will be stored
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  }
});

