import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(",") || "http://localhost:5173",
    credentials: true,
  })
);

//routers
import userRouter from "./routes/user.route.js";
import locationRoter from "./routes/location.route.js";
import tipCategoryRouter from "./routes/tipCategory.route.js";
import tipRouter from "./routes/tip.route.js";
import likeRouter from "./routes/like.route.js";

//basic configuration
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).send("hii welcome");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/location", locationRoter);
app.use("/api/v1/tipCategory", tipCategoryRouter);
app.use("/api/v1/tip", tipRouter);
app.use("/api/v1/like", likeRouter);
app.use(errorHandler);

export { app };
