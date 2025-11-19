import multer from "multer";
import path from "path";
import { rootDir } from "../utils/rootDir.js"; // make sure to include .js in ES module

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(rootDir, "public", "temp"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.floor(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}-${file.fieldname}${ext}`);
  },
});
export const upload = multer({ storage });
