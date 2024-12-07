export class UserNotAllowedError extends Error {
  constructor() {
    super('UNAUTHORIZED')
  }
}
