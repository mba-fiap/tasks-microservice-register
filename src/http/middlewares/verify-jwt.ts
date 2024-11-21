import { FastifyRequest } from 'fastify'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'

export async function verifyJwt(request: FastifyRequest) {
  try {
    await request.jwtVerify()
  } catch {
    throw new UserNotAllowedError()
  }
}
