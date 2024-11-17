import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DropUseCase } from '@/use-cases/drop'

export function makeDropUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const dropUseCase = new DropUseCase(usersRepository)

  return dropUseCase
}
