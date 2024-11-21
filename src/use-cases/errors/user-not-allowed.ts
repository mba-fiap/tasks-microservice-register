export class UserNotAllowedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}
