import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export const profileSchema = {
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
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export async function profile(request: FastifyRequest, reply: FastifyReply) {
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
}
