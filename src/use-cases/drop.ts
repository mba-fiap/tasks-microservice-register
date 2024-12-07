import { EXCHANGES, ROUTING_KEYS } from '@/config/events'
import { container } from 'tsyringe'

import { UsersRepository } from '@/repositories/users-repository'

import { IEventsProviderModel } from '@/shared/providers/EventsProvider/IEventsProviderModel'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface DropUseCaseRequest {
  userId: string
}

export class DropUseCase {
  private eventsProvider: IEventsProviderModel

  constructor(private usersRepository: UsersRepository) {
    this.eventsProvider =
      container.resolve<IEventsProviderModel>('EventsProvider')
  }

  async execute({ userId }: DropUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    this.eventsProvider.publish({
      exchange: EXCHANGES.USER,
      routingKey: ROUTING_KEYS.USER.DROPPPED,
      data: {
        id: userId,
      },
    })

    await this.usersRepository.delete(userId)
  }
}
