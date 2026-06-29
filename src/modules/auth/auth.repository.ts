import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
type UserCreate = Prisma.usersUncheckedCreateInput;

class AuthRepository {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: UserCreate) {
    return prisma.users.create({
      data,
    });
  }

  async findById(id: bigint) {
    return prisma.users.findUnique({
      where: {
        id,
      },
    });
  }
}

export default new AuthRepository();
