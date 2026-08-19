import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import titleRoutes from "./routes/titleRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que o caminho absoluto da pasta uploads exista
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Habilita CORS
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Servir os arquivos estáticos de imagem
app.use("/uploads", express.static(uploadDir));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/titulos", titleRoutes);

app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});
