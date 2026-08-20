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
const PORT = process.env.PORT || 10000;
// Configuração robusta de CORS liberando para a Vercel e requisições públicas
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(express.json());

app.use("/uploads", express.static(uploadDir));

// Rota base para teste rápido de status
app.get("/", (req, res) => {
  res.send("API WhatToWatch rodando perfeitamente!");
});

app.use("/api/auth", authRoutes);
app.use("/api/titulos", titleRoutes);

// Obrigatório para o Render: escutar em '0.0.0.0'
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
