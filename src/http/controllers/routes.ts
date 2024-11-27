import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { register, registerSchema } from './register'

import { authenticate, authenticateSchema } from './authenticate'

import { profile, profileSchema } from './profile'

import { update, updateSchema } from './update'

import { drop, dropSchema } from './drop'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', {
    handler: register,
    schema: registerSchema,
  })

  app.post('/sessions', {
    handler: authenticate,
    schema: authenticateSchema,
  })

  app.get('/users', {
    onRequest: [verifyJwt],
    handler: profile,
    schema: profileSchema,
  })

  app.put('/users', {
    onRequest: [verifyJwt],
    handler: update,
    schema: updateSchema,
  })

  app.delete('/users', {
    onRequest: [verifyJwt],
    handler: drop,
    schema: dropSchema,
  })
}
