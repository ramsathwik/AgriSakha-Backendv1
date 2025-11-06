import express from "express";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.get("/", (req, res) => {
  return res.status(200).send("hii welcome");
});

export { app };
