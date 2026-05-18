import dotenv from "dotenv";
import { rootDir } from "./src/utils/rootDir.js";
import path from "path";
// console.log(rootDir);
// console.log(path.resolve(rootDir, ".env"));
dotenv.config(path.resolve(rootDir, ".env"));
