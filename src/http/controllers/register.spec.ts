import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
    )
  })

  it('should not allow registering with an existing email', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/users').send({
      name: 'Jane Doe',
      email: 'johndoe@example.com',
      password: 'abcdef',
    })

    expect(response.statusCode).toEqual(409)

    expect(response.body).toEqual({
      message: new UserAlreadyExistsError().message,
    })
  })

  it('should return validation error for invalid data', async () => {
    const response = await request(app.server).post('/users').send({
      name: '',
      email: 'invalid-email',
      password: '123',
    })

    expect(response.statusCode).toEqual(400)
  })
})
