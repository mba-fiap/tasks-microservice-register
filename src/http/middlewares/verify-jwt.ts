import { FastifyReply, FastifyRequest } from 'fastify'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply
      .status(401)
      .send({ message: new UserNotAllowedError().message })
  }
}
