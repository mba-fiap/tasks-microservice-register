import { User, Prisma, Role } from '@prisma/client'

import { randomUUID } from 'node:crypto'

import { UsersRepository } from '@/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const { name, email, password_hash, role } = data

    const user = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      role: role || Role.MEMBER,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async save(task: User): Promise<User> {
    const index = this.items.findIndex((item) => item.id === task.id)

    this.items[index] = task

    return task
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
