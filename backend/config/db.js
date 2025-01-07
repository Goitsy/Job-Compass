import mongoose from "mongoose";

export const connect = () => {
  mongoose.connection.on("connected", () => {
    console.log("Your Mongo DB is successfully connected");
  });
  mongoose.connection.on("error", (error) => {
    console.log("DB connection error", error);
  });
  const uri = process.env.MONGO_URI;

  return mongoose.connect(uri);
};
