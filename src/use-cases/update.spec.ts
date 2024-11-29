import { hash, compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

import { UpdateUseCase } from './update'

let usersRepository: InMemoryUsersRepository

let sut: UpdateUseCase

describe('Update Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new UpdateUseCase(usersRepository)
  })

  it('should update user name', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const updatedUser = await sut.execute({
      userId: user.id,
      name: 'John Updated',
    })

    expect(updatedUser.name).toBe('John Updated')

    expect(updatedUser.email).toBe(user.email)
  })

  it('should update user email', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const updatedUser = await sut.execute({
      userId: user.id,
      email: 'updated@example.com',
    })

    expect(updatedUser.email).toBe('updated@example.com')

    expect(updatedUser.name).toBe(user.name)
  })

  it('should update user password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const updatedUser = await sut.execute({
      userId: user.id,
      password: 'newpassword',
    })

    const isPasswordCorrectlyHashed = await compare(
      'newpassword',
      updatedUser.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        name: 'New Name',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw UserAlreadyExistsError if email is already in use by another user', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'existing@example.com',
      password_hash: await hash('123456', 6),
    })

    const user = await usersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        email: 'existing@example.com',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not update fields that are not provided', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const updatedUser = await sut.execute({
      userId: user.id,
    })

    expect(updatedUser.name).toBe('John Doe')

    expect(updatedUser.email).toBe('johndoe@example.com')

    expect(updatedUser.password_hash).toBe(user.password_hash)
  })
})
