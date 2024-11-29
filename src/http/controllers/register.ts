import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

const registerContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

export const registerSchema = {
  tags: ['Users'],
  body: zodToJsonSchema(registerBodySchema),
  response: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: zodToJsonSchema(registerContentSchema),
        },
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

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const user = await registerUseCase.execute({
      name,
      email,
      password,
    })

    return reply.status(201).send(user)
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
}
