import { app } from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = process.env.PORT;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
  });
});
