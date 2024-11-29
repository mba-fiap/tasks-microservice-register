import { FastifyReply, FastifyRequest } from 'fastify'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeDropUseCase } from '@/use-cases/factories/make-drop-use-case'

export const dropSchema = {
  tags: ['Users'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    201: {
      description: 'User dropped successfully',
      type: 'null',
    },
    401: {
      description: new UserNotAllowedError().message,
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    404: {
      description: new UserNotFoundError().message,
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export async function drop(request: FastifyRequest, reply: FastifyReply) {
  try {
    const dropUseCase = makeDropUseCase()

    await dropUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof UserNotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
