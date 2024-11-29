import { app } from '@/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'

import { createAndAuthenticateUser } from './create-and-authenticate-user'

describe('createAndAuthenticateUser (util)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()

    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should create and authenticate a user successfully', async () => {
    const { token } = await createAndAuthenticateUser({ app })

    expect(token).toBeDefined()

    const user = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(user).toBeDefined()

    expect(user?.name).toEqual('John Doe')
  })

  it('should create an admin user if isAdmin is true', async () => {
    const { token } = await createAndAuthenticateUser({ app, isAdmin: true })

    expect(token).toBeDefined()

    const user = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(user).toBeDefined()

    expect(user?.role).toEqual('ADMIN')
  })
})
