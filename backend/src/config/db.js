import mongoose from "mongoose";

const connectDb = async () => {
  await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
  console.log("conncted to db");
};

export { connectDb };
