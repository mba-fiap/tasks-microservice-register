import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { zodToJsonSchema } from 'zod-to-json-schema'

import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = {
  tags: ['Users'],
  body: zodToJsonSchema(registerBodySchema),
  response: {
    201: {
      description: 'OK',
      type: 'null',
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

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
