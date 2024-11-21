import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { zodToJsonSchema } from 'zod-to-json-schema'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

const profileContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

export const profileSchema = {
  tags: ['Users'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    201: {
      description: 'User profile retrieved successfully',
      content: {
        'application/json': {
          schema: zodToJsonSchema(profileContentSchema),
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
  },
}

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = makeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  } catch (err) {
    if (err instanceof UserNotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
