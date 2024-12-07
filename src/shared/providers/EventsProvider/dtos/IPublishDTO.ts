export interface IPublishDTO {
  exchange: {
    name: string
    type: 'topic' | 'direct' | 'fanout'
  }
  routingKey: string
  data: any
}
