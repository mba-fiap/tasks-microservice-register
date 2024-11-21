import swagger from '@fastify/swagger'

import swaggerUi from '@fastify/swagger-ui'

import { readFileSync } from 'fs'

import { resolve } from 'path'

import { FastifyInstance } from 'fastify'

import { env } from '@/env'

const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

export async function appSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'FIAP Tasks Microservice Register',
        description: packageJson.description || 'API Documentation',
        version: packageJson.version || '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Servidor Local',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
}
