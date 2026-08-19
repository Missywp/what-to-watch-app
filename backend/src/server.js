import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import titleRoutes from "./routes/titleRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Permite conexões de qualquer porta local (5173, 5174, 5175, etc.)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Servir os arquivos de imagem da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/titulos", titleRoutes);

app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});
