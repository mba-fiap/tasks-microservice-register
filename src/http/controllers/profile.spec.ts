import request from 'supertest'

import { app } from '@/app'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'

describe('Profile (e2e)', () => {
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

  it('should retrieve user profile successfully', async () => {
    const response = await request(app.server)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
    )
  })

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app.server).get('/users')

    expect(response.statusCode).toEqual(401)

    expect(response.body).toEqual({
      message: new UserNotAllowedError().message,
    })
  })
})
