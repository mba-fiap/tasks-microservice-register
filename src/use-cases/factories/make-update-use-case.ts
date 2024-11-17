import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UpdateUseCase } from '@/use-cases/update'

export function makeUpdateUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const updateUseCase = new UpdateUseCase(usersRepository)

  return updateUseCase
}
