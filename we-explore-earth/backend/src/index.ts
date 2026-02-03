import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./firestore"; // This initializes Firebase Admin
import userRouter from "./routes/userRouter";
import eventRouter from "./routes/eventRouter";
import configRouter from './routes/configRouter';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/config", configRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
