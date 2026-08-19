import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ mensagem: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Credenciais inválidas." });
    }

    const segredoJwt =
      process.env.JWT_SECRET || "whattowatch_segredo_padrao_local";

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      segredoJwt,
      { expiresIn: "7d" },
    );

    return res.json({ token, email: usuario.email });
  } catch (error) {
    console.error("Erro interno no login:", error);
    return res.status(500).json({ mensagem: "Erro ao realizar login." });
  }
});

export default router;
