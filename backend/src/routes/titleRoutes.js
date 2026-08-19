import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { autenticarToken } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

const CINEMA_FALLBACK_URL =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

// Configuração do Multer para salvar imagens com nomes únicos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const formatarParaResposta = (item) => ({
  ...item,
  generos:
    typeof item.generos === "string" ? JSON.parse(item.generos) : item.generos,
});

// GET /api/titulos (Público)
router.get("/", async (req, res) => {
  try {
    const { genero, tipo, busca } = req.query;
    const titulos = await prisma.titulo.findMany({
      orderBy: { createdAt: "desc" },
    });

    let resultado = titulos.map(formatarParaResposta);

    if (tipo && tipo !== "todos") {
      resultado = resultado.filter((t) => t.tipo === tipo);
    }
    if (genero && genero !== "todos") {
      resultado = resultado.filter((t) => t.generos.includes(genero));
    }
    if (busca) {
      const q = busca.toLowerCase();
      resultado = resultado.filter(
        (t) =>
          t.titulo.toLowerCase().includes(q) ||
          t.sinopse.toLowerCase().includes(q),
      );
    }

    return res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar títulos:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar títulos." });
  }
});

// POST /api/titulos (Upload de imagem + Cadastro)
router.post("/", autenticarToken, upload.single("imagem"), async (req, res) => {
  const { titulo, tipo, generos, sinopse, nota, ano } = req.body;

  const posterUrl = req.file
    ? `http://localhost:5000/uploads/${req.file.filename}`
    : CINEMA_FALLBACK_URL;

  try {
    const parsedGeneros =
      typeof generos === "string"
        ? generos.split(",").map((g) => g.trim().toLowerCase())
        : generos;

    const novoTitulo = await prisma.titulo.create({
      data: {
        titulo,
        tipo,
        generos: JSON.stringify(parsedGeneros || []),
        sinopse,
        nota: parseFloat(nota),
        ano: parseInt(ano, 10),
        posterUrl,
      },
    });

    return res.status(201).json(formatarParaResposta(novoTitulo));
  } catch (error) {
    console.error("Erro ao cadastrar título:", error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar título." });
  }
});

// PUT /api/titulos/:id (Atualização com upload opcional e exclusão de imagem)
router.put(
  "/:id",
  autenticarToken,
  upload.single("imagem"),
  async (req, res) => {
    const { id } = req.params;
    const { titulo, tipo, generos, sinopse, nota, ano, removerImagem } =
      req.body;

    try {
      const dadosAtualizados = {
        titulo,
        tipo,
        generos: JSON.stringify(
          typeof generos === "string"
            ? generos.split(",").map((g) => g.trim().toLowerCase())
            : generos,
        ),
        sinopse,
        nota: parseFloat(nota),
        ano: parseInt(ano, 10),
      };

      if (req.file) {
        dadosAtualizados.posterUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      } else if (removerImagem === "true") {
        dadosAtualizados.posterUrl = CINEMA_FALLBACK_URL;
      }

      const tituloAtualizado = await prisma.titulo.update({
        where: { id },
        data: dadosAtualizados,
      });

      return res.json(formatarParaResposta(tituloAtualizado));
    } catch (error) {
      console.error("Erro ao atualizar título:", error);
      return res.status(500).json({ mensagem: "Erro ao atualizar título." });
    }
  },
);

// DELETE /api/titulos/:id
router.delete("/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.titulo.delete({ where: { id } });
    return res.json({ mensagem: "Título removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar título:", error);
    return res.status(500).json({ mensagem: "Erro ao deletar título." });
  }
});

export default router;
