import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeUpdateUseCase } from '@/use-cases/factories/make-update-use-case'

const updateBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})

const updateContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

export const updateSchema = {
  tags: ['Users'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  body: zodToJsonSchema(updateBodySchema),
  response: {
    200: {
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: zodToJsonSchema(updateContentSchema),
        },
      },
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
    409: {
      description: new UserAlreadyExistsError().message,
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = updateBodySchema.parse(request.body)

  try {
    const updateUseCase = makeUpdateUseCase()

    const user = await updateUseCase.execute({
      name,
      email,
      password,
      userId: request.user.sub,
    })

    return reply.status(200).send({
      ...user,
      password_hash: undefined,
    })
  } catch (err) {
    if (err instanceof UserNotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
