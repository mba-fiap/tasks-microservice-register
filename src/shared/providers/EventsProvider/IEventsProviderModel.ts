import { IListenDTO, IPublishDTO } from '@/shared/providers/EventsProvider/dtos'

export interface IEventsProviderModel {
  listen(data: IListenDTO): Promise<void>
  publish(data: IPublishDTO): Promise<void>
}
