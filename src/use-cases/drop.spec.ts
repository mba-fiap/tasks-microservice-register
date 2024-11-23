import { expect, describe, it, beforeEach } from 'vitest'

import { DropUseCase } from './drop'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

let usersRepository: InMemoryUsersRepository

let sut: DropUseCase

describe('Drop Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new DropUseCase(usersRepository)
  })

  it('should delete a user by ID', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed_password',
    })

    await sut.execute({ userId: user.id })

    const deletedUser = await usersRepository.findById(user.id)

    expect(deletedUser).toBeNull()
  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not affect other users when deleting a user', async () => {
    const user1 = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed_password',
    })

    const user2 = await usersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: 'hashed_password',
    })

    await sut.execute({ userId: user1.id })

    const remainingUser = await usersRepository.findById(user2.id)

    expect(remainingUser).toBeDefined()

    expect(remainingUser?.id).toBe(user2.id)
  })
})
