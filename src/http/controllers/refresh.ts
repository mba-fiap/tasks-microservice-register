import { FastifyReply, FastifyRequest } from 'fastify'

export const refreshSchema = {
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

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

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
}
