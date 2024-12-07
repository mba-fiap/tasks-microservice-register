import { EXCHANGES, ROUTING_KEYS } from '@/config/events'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { container } from 'tsyringe'

import { UsersRepository } from '@/repositories/users-repository'

import { IEventsProviderModel } from '@/shared/providers/EventsProvider/IEventsProviderModel'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface UpdateUseCaseRequest {
  name?: string
  email?: string
  password?: string
  userId: string
}

export class UpdateUseCase {
  private eventsProvider: IEventsProviderModel

  constructor(private usersRepository: UsersRepository) {
    this.eventsProvider =
      container.resolve<IEventsProviderModel>('EventsProvider')
  }

  async execute({
    name,
    email,
    password,
    userId,
  }: UpdateUseCaseRequest): Promise<User> {
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

    this.usersRepository.save(user)

    if (name || email) {
      this.eventsProvider.publish({
        exchange: EXCHANGES.USER,
        routingKey: ROUTING_KEYS.USER.UPDATED,
        data: {
          ...user,
          password_hash: undefined,
        },
      })
    }

    return user
  }
}
