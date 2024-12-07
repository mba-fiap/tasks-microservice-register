export const EXCHANGES: {
  [key: string]: {
    name: string
    type: 'topic' | 'direct' | 'fanout'
  }
} = {
  USER: {
    name: 'user.events',
    type: 'topic',
  },
}

export const ROUTING_KEYS: {
  [key: string]: {
    [key: string]: string
  }
} = {
  USER: {
    CREATED: 'user.created',
    UPDATED: 'user.updated',
    DROPPPED: 'user.dropped',
  },
}
