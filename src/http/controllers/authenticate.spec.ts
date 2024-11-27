import request from 'supertest'

import { hash } from 'bcryptjs'

import { app } from '@/app'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

import { ValidationError } from '@/use-cases/errors/validation-error'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
        role: 'MEMBER',
      },
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany()

    await app.close()
  })

  it('should authenticate a user successfully', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })

  it('should not authenticate with invalid credentials', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: 'wrongpassword',
    })

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual({
      message: new InvalidCredentialsError().message,
    })
  })

  it('should validate request data', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'not-an-email',
      password: '123',
    })

    expect(response.statusCode).toEqual(400)

    expect(response.body).toEqual(
      expect.objectContaining({
        message: new ValidationError().message,
      })
    )
  })
})
