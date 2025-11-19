import express from "express";
import cookieParser from "cookie-parser";
const app = express();

//routers
import userRouter from "./routes/user.route.js";

//basic configuration
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).send("hii welcome");
});
app.use("/api/v1/user", userRouter);

export { app };
