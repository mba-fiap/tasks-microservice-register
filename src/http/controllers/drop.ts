import { FastifyReply, FastifyRequest } from 'fastify'

import { makeDropUseCase } from '@/use-cases/factories/make-drop-use-case'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

export const dropSchema = {
  tags: ['Users'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    201: {
      description: 'OK',
      type: 'null',
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
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
