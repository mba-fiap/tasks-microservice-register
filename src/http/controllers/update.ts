import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { zodToJsonSchema } from 'zod-to-json-schema'

import { makeUpdateUseCase } from '@/use-cases/factories/make-update-use-case'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

const updateBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
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

    await updateUseCase.execute({
      name,
      email,
      password,
      userId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
