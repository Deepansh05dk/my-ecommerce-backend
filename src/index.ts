import express from "express";
import cors from "cors";
import { v1Router } from "./router/v1";
import dotenv from "dotenv";
import ErrorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

//routes
app.use("/api/v1", v1Router);

//error middleware
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
