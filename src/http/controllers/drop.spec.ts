import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Drop (e2e)', () => {
  let token: string

  beforeAll(async () => {
    await app.ready()

    const auth = await createAndAuthenticateUser({ app })

    token = auth.token
  })

  afterAll(async () => {
    await prisma.user.deleteMany()

    await app.close()
  })

  it('should drop user successfully', async () => {
    const response = await request(app.server)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(201)

    expect(response.body).toEqual({})
  })

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app.server).delete('/users')

    expect(response.statusCode).toEqual(401)

    expect(response.body).toEqual({
      message: new UserNotAllowedError().message,
    })
  })

  it('should return 404 if user is not found', async () => {
    await prisma.user.deleteMany()

    const response = await request(app.server)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(404)

    expect(response.body).toEqual({
      message: new UserNotFoundError().message,
    })
  })
})
