import request from 'supertest'

import { hash } from 'bcryptjs'

import { app } from '@/app'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

import { UserNotAllowedError } from '@/use-cases/errors/user-not-allowed'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

describe('Update (e2e)', () => {
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

  beforeEach(async () => {
    await prisma.user.update({
      where: { email: 'johndoe@example.com' },
      data: { name: 'John Doe' },
    })
  })

  it('should update user information successfully', async () => {
    const response = await request(app.server)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Updated',
      })

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Updated',
        email: 'johndoe@example.com',
      })
    )
  })

  it('should not allow update if user is not authenticated', async () => {
    const response = await request(app.server).put('/users').send({
      name: 'John Updated',
    })

    expect(response.statusCode).toEqual(401)

    expect(response.body).toEqual({
      message: new UserNotAllowedError().message,
    })
  })

  it('should not update if email is already in use', async () => {
    await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password_hash: await hash('abcdef', 6),
      },
    })

    const response = await request(app.server)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'janedoe@example.com',
      })

    expect(response.statusCode).toEqual(409)

    expect(response.body).toEqual({
      message: new UserAlreadyExistsError().message,
    })
  })

  it('should return 404 if user is not found', async () => {
    await prisma.user.deleteMany()

    const response = await request(app.server)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Updated',
      })

    expect(response.statusCode).toEqual(404)

    expect(response.body).toEqual({
      message: new UserNotFoundError().message,
    })
  })
})
