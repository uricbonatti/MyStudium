import { GraphQLScalarType } from 'graphql';
import ValidationError from './ValidationError';

interface INumericArgs {
  min?: number;
  max?: number;
  exclusiveMin?: number;
  exclusiveMax?: number;
  multipleOf?: number;
}

function validate(fieldName: string, args: INumericArgs, value: number): void {
  if (args.min && value < args.min) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be at least ${args.min}`,
      [{ arg: 'min', value: args.min }],
    );
  }
  if (args.max && value > args.max) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be no greater than ${args.max}`,
      [{ arg: 'max', value: args.max }],
    );
  }

  if (args.exclusiveMin && value <= args.exclusiveMin) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be greater than ${args.exclusiveMin}`,
      [{ arg: 'exclusiveMin', value: args.exclusiveMin }],
    );
  }
  if (args.exclusiveMax && value >= args.exclusiveMax) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be less than ${args.exclusiveMax}`,
      [{ arg: 'exclusiveMax', value: args.exclusiveMax }],
    );
  }

  if (args.multipleOf && value % args.multipleOf !== 0) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be a multiple of ${args.multipleOf}`,
      [{ arg: 'multipleOf', value: args.multipleOf }],
    );
  }
}

class NumberValidation extends GraphQLScalarType {
  constructor(fieldName: string, type: any, args: INumericArgs) {
    super({
      name: 'ValidateNumber',
      serialize(value) {
        value = type.serialize(value);
        validate(fieldName, args, value);
        return value;
      },
      parseValue(value) {
        value = type.serialize(value);
        validate(fieldName, args, value);
        return type.parseValue(value);
      },
      parseLiteral(ast) {
        const value = type.parseLiteral(ast);
        validate(fieldName, args, value);
        return value;
      },
    });
  }
}

export default NumberValidation;
