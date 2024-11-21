import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { zodToJsonSchema } from 'zod-to-json-schema'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'

const refreshContentSchema = z.object({
  token: z.string(),
})

export const refreshSchema = {
  tags: ['Users'],
  security: [
    {
      bearerAuth: [],
    },
  ],
  response: {
    201: {
      description: 'Refresh token created successfully',
      content: {
        'application/json': {
          schema: zodToJsonSchema(refreshContentSchema),
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

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  try {
    const { role } = request.user

    const token = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: request.user.sub,
        },
      }
    )

    const refreshToken = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: request.user.sub,
          expiresIn: '7d',
        },
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof UserNotAllowedError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
