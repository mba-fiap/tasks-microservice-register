import { prisma } from '@/lib/prisma'

import { User, Prisma } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async save(task: User): Promise<User> {
    return prisma.user.update({
      where: {
        id: task.id,
      },
      data: task,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
