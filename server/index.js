import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";

dotenv.config();

// Note: dbConnection is now called after app.listen to ensure Railway health checks pass quickly.
// Mongoose will buffer commands until the connection is established.


const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: true, // Reflects the request origin automatically
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

// Health check for deployed backends that may receive GET /
app.get("/", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    dbConnection(); // Initialize DB connection after port is open
  });
}

export default app;
