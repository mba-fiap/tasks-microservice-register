import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserProfileUseCaseRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return user
  }
}
