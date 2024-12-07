import { container } from 'tsyringe'

import { IEventsProviderModel } from './IEventsProviderModel'
import { AmqpEventsProvider } from './implementations/amqp-events-provider'

const providers = {
  amqp: AmqpEventsProvider,
}

container.registerSingleton<IEventsProviderModel>(
  'EventsProvider',
  providers.amqp
)
