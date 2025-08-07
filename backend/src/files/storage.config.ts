import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from "fs";

function generateFilename(file) {
  const timestamp = Date.now();
  const extension = extname(file.originalname);
  const fieldname = file.fieldname || 'file';
  
  return `${fieldname}_${timestamp}${extension}`;
}

export const storage = diskStorage({
  destination: (req, file, callback) => {
    let uploadPath = './public/images'; // default path

    // Split files into different folders based on fieldname or file type
    if (file.fieldname === 'avatar' || file.fieldname === 'profile') {
      uploadPath = './public/avatars';
    } else if (file.fieldname === 'post' || file.fieldname === 'postImage') {
      uploadPath = './public/posts';
    } else if (file.fieldname === 'resume' || file.fieldname === 'document') {
      uploadPath = './public/documents';
    } else if (file.fieldname === 'video' || file.mimetype.startsWith('video/')) {
      uploadPath = './public/videos';
    } else if (file.mimetype.startsWith('image/')) {
      uploadPath = './public/images';
    } else if (file.mimetype.startsWith('application/')) {
      uploadPath = './public/documents';
    }

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  }
});

