import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("mel2005admin", 10);

  // Limpa e recria o admin original
  await prisma.user.deleteMany({});
  await prisma.user.create({
    data: {
      email: "admin@whattowatch.com",
      senha: senhaHash,
    },
  });

  console.log("Admin restaurado: admin@whattowatch.com (Senha: mel2005admin)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
