import fastify from 'fastify'

import fastifyJwt from '@fastify/jwt'

import fastifyCookie from '@fastify/cookie'

import { ZodError } from 'zod'

import { env } from '@/env'

import { appRoutes } from '@/http/controllers/routes'

import { appSwagger } from './swagger'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '60m',
  },
})

app.register(fastifyCookie)

appSwagger(app)

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
