import { UsersRepository } from '@/repositories/users-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface DropUseCaseRequest {
  userId: string
}

export class DropUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: DropUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    await this.usersRepository.delete(userId)
  }
}
