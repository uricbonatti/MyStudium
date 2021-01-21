//Verificar se esta ok

class ValidationError extends Error {
  public name: string;
  public code: 'BAD_USER_INPUT';
  constructor(public fieldName: string, message: string, public context: any) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ValidationError;
