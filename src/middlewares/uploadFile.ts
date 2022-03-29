import multer from "multer";
import { Request } from "express";
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, done) => {
    done(null, "upload");
  },
  filename: (req, file, done) => {
    done(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, done: any) => {
  const mimetype = file.mimetype;
  if (mimetype.includes("jpg") || mimetype.includes("png") || mimetype.includes("jpeg")) {
    return done(null, true);
  }
  done(null, false);
};

let upload = multer({ storage, fileFilter });

export default upload;
