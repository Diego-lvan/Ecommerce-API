"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, done) => {
        done(null, "upload");
    },
    filename: (req, file, done) => {
        done(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, done) => {
    const mimetype = file.mimetype;
    if (mimetype.includes("jpg") || mimetype.includes("png") || mimetype.includes("jpeg")) {
        return done(null, true);
    }
    done(null, false);
};
let upload = (0, multer_1.default)({ storage, fileFilter });
exports.default = upload;
