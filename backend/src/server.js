import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import titleRoutes from "./routes/titleRoutes.js";

dotenv.config();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/uploads", express.static(uploadDir));

app.use("/api/auth", authRoutes);
app.use("/api/titulos", titleRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
