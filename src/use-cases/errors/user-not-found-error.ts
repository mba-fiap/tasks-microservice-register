export class UserNotFoundError extends Error {
  constructor() {
    super('USER_NOT_FOUND')
  }
}
