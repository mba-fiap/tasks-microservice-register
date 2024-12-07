import { EXCHANGES, ROUTING_KEYS } from '@/config/events'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { container } from 'tsyringe'

import { UsersRepository } from '@/repositories/users-repository'

import { IEventsProviderModel } from '@/shared/providers/EventsProvider/IEventsProviderModel'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private eventsProvider: IEventsProviderModel

  constructor(private usersRepository: UsersRepository) {
    this.eventsProvider =
      container.resolve<IEventsProviderModel>('EventsProvider')
  }

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<User> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    // TEAMS API - POST /teams user.name

    this.eventsProvider.publish({
      exchange: EXCHANGES.USER,
      routingKey: ROUTING_KEYS.USER.CREATED,
      data: {
        ...user,
        password_hash: undefined,
      },
    })

    return user
  }
}
