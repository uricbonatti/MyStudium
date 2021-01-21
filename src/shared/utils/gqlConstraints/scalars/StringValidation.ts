import { GraphQLScalarType } from 'graphql';

import validator from 'validator';
const { contains, isLength } = validator;

import ValidationError from './ValidationError';
import stringFormats from './stringFormats';

interface IStringArgs {
  minLength?: number;
  maxLength?: number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  notContains?: string;
  pattern?: string;
  format?: string;
}

function validate(fieldName: string, args: IStringArgs, value: string) {
  if (args.minLength && !isLength(value, { min: args.minLength })) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be at least ${args.minLength} characters in length`,
      [{ arg: 'minLength', value: args.minLength }],
    );
  }
  if (args.maxLength && !isLength(value, { max: args.maxLength })) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must be no more than ${args.maxLength} characters in length`,
      [{ arg: 'maxLength', value: args.maxLength }],
    );
  }

  if (args.startsWith && !value.startsWith(args.startsWith)) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must start with ${args.startsWith}`,
      [{ arg: 'startsWith', value: args.startsWith }],
    );
  }

  if (args.endsWith && !value.endsWith(args.endsWith)) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must end with ${args.endsWith}`,
      [{ arg: 'endsWith', value: args.endsWith }],
    );
  }

  if (args.contains && !contains(value, args.contains)) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must contain ${args.contains}`,
      [{ arg: 'contains', value: args.contains }],
    );
  }

  if (args.notContains && contains(value, args.notContains)) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must not contain ${args.notContains}`,
      [{ arg: 'notContains', value: args.notContains }],
    );
  }

  if (args.pattern && !new RegExp(args.pattern).test(value)) {
    throw new ValidationError(
      fieldName,
      `${fieldName} must match ${args.pattern}`,
      [{ arg: 'pattern', value: args.pattern }],
    );
  }

  if (args.format) {
    let formatter: Function | undefined;
    switch (args.format) {
      case 'byte':
        formatter = stringFormats.byte;
        break;
      case 'datetime':
        formatter = stringFormats.datetime;
        break;
      case 'date':
        formatter = stringFormats.date;
        break;
      case 'email':
        formatter = stringFormats.email;
        break;
      case 'ipv4':
        formatter = stringFormats.ipv4;
        break;
      case 'ipv6':
        formatter = stringFormats.ipv6;
        break;
      case 'url':
        formatter = stringFormats.url;
        break;
      case 'uuid':
        formatter = stringFormats.byte;
        break;
    }

    if (!formatter) {
      throw new ValidationError(
        fieldName,
        `${fieldName} has invalid format type ${args.format}`,
        [{ arg: 'format', value: args.format }],
      );
    }

    try {
      formatter(value); // Will throw if invalid
    } catch (error) {
      throw new ValidationError(fieldName, error.message, [
        { arg: 'format', value: args.format },
      ]);
    }
  }
}

class StringValidation extends GraphQLScalarType {
  constructor(
    public fieldName: string,
    public type: any,
    public args: IStringArgs,
  ) {
    super({
      name: 'ValidateString',
      serialize(val) {
        const value = type.serialize(val);
        validate(fieldName, args, value);
        return value;
      },
      parseValue(val) {
        const value = type.parseValue(val);
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

export default StringValidation;
