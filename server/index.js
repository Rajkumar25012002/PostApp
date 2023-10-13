import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin:"https://rockys-post-app.netlify.app",
    credentials: true,
  })
);

const url = process.env.MONGO_URL;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
app.use("/user", userRouter);
app.use("/post", postRouter);
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.info("Connected to database ");
  })
  .catch((err) => console.log(`Error connecting to the database.${err}`));

app.listen({ port: process.env.PORT }, () => {
  console.log(`server is running @ port ${process.env.PORTm}`);
});
