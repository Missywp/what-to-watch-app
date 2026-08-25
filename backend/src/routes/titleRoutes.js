import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { autenticarToken } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

const CINEMA_FALLBACK_URL =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

const normalizar = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const formatarParaResposta = (item) => ({
  ...item,
  generos:
    typeof item.generos === "string" ? JSON.parse(item.generos) : item.generos,
});

// GET /api/titulos
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
      const generoBuscado = normalizar(genero);
      resultado = resultado.filter(
        (t) =>
          Array.isArray(t.generos) &&
          t.generos.some((g) => normalizar(g) === generoBuscado),
      );
    }
    if (busca) {
      const q = normalizar(busca);
      resultado = resultado.filter(
        (t) =>
          normalizar(t.titulo).includes(q) ||
          (t.sinopse && normalizar(t.sinopse).includes(q)),
      );
    }

    return res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar títulos:", error);
    return res.status(500).json({ mensagem: "Erro ao buscar títulos." });
  }
});

router.post("/", autenticarToken, async (req, res) => {
  const { titulo, tipo, generos, sinopse, nota, ano, posterUrl } = req.body;

  const posterFinal =
    posterUrl && String(posterUrl).trim() !== ""
      ? String(posterUrl).trim()
      : CINEMA_FALLBACK_URL;

  try {
    const parsedGeneros =
      typeof generos === "string"
        ? generos
            .split(",")
            .map((g) => normalizar(g))
            .filter(Boolean)
        : Array.isArray(generos)
          ? generos.map((g) => normalizar(g))
          : [];

    const novoTitulo = await prisma.titulo.create({
      data: {
        titulo: String(titulo),
        tipo: String(tipo || "filme"),
        generos: JSON.stringify(parsedGeneros),
        sinopse: String(sinopse || ""),
        nota: isNaN(parseFloat(nota)) ? 0 : parseFloat(nota),
        ano: isNaN(parseInt(ano, 10))
          ? new Date().getFullYear()
          : parseInt(ano, 10),
        posterUrl: posterFinal,
      },
    });

    return res.status(201).json(formatarParaResposta(novoTitulo));
  } catch (error) {
    console.error("Erro ao cadastrar título:", error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar título." });
  }
});

router.put("/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;
  const { titulo, tipo, generos, sinopse, nota, ano, posterUrl } = req.body;

  try {
    const parsedGeneros =
      typeof generos === "string"
        ? generos
            .split(",")
            .map((g) => normalizar(g))
            .filter(Boolean)
        : Array.isArray(generos)
          ? generos.map((g) => normalizar(g))
          : [];

    const dadosAtualizados = {
      titulo: String(titulo),
      tipo: String(tipo || "filme"),
      generos: JSON.stringify(parsedGeneros),
      sinopse: String(sinopse || ""),
      nota: isNaN(parseFloat(nota)) ? 0 : parseFloat(nota),
      ano: isNaN(parseInt(ano, 10))
        ? new Date().getFullYear()
        : parseInt(ano, 10),
      posterUrl:
        posterUrl && String(posterUrl).trim() !== ""
          ? String(posterUrl).trim()
          : CINEMA_FALLBACK_URL,
    };

    const tituloAtualizado = await prisma.titulo.update({
      where: { id },
      data: dadosAtualizados,
    });

    return res.json(formatarParaResposta(tituloAtualizado));
  } catch (error) {
    console.error("Erro ao atualizar título:", error);
    return res.status(500).json({ mensagem: "Erro ao atualizar título." });
  }
});

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
