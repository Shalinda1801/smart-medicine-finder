export type FieldErrors = Record<string, string[]>;

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 500,
    public readonly fieldErrors?: FieldErrors,
  ) {
    super(message);

    this.name = "AppError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}