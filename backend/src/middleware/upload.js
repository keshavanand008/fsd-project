import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

// ensure uploads dir exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const types = /jpg|jpeg|png|webp/;
    const ext = types.test(path.extname(file.originalname).toLowerCase());
    const mime = types.test(file.mimetype);

    if (ext && mime) cb(null, true);
    else cb(new Error("Invalid image type"));
  }
});

export default upload;
