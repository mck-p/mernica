let errorCode = 1000;

export class NotImplemented extends Error {
  constructor(functionName) {
    super();

    this.message = `You did not implemented the "${functionName}" function ya silly head!`;

    this.code = errorCode++;
  }
}
