export class FenParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FenParseError";
  }
}
