import { hash } from 'bcryptjs'

import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

interface UpdateUseCaseRequest {
  name?: string
  email?: string
  password?: string
  userId: string
}

interface UpdateUseCaseResponse {
  user: User
}

export class UpdateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    userId,
  }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (email) {
      const userEmail = await this.usersRepository.findByEmail(email)

      if (userEmail && userEmail.id !== user.id) {
        throw new UserAlreadyExistsError()
      }

      user.email = email
    }

    user.name = name ?? user.name

    if (password) {
      user.password_hash = await hash(password, 6)
    }

    return {
      user,
    }
  }
}
