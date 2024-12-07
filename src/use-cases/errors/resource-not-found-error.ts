export class ResourceNotFoundError extends Error {
  constructor() {
    super('RESOURCE_NOT_FOUND')
  }
}
