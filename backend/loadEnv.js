import dotenv from "dotenv";
import { rootDir } from "./src/utils/rootDir.js";
import path from "path";
dotenv.config(path.resolve(rootDir, ".env"));
