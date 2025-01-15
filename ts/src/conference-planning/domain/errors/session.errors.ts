export interface ApplicationError {
  toReturnCode: () => number
}

export class SessionError extends Error implements ApplicationError {
  constructor(message: string) {
    super(message)
  }

  toReturnCode(): number {
    return 400
  };
}
