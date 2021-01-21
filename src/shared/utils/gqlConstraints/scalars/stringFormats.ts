import { GraphQLError } from 'graphql/error';
import validator from 'validator';

const {
  isBase64,
  isRFC3339,
  isISO8601,
  isEmail: isEmailValidator,
  isIP,
  isURL,
  isUUID: isUUIDValidator,
} = validator;

const isByte = (value: string) => {
  if (isBase64(value)) return true;

  throw new GraphQLError('Must be in byte format');
};

const isDateTime = (value: string) => {
  if (isRFC3339(value)) return true;

  throw new GraphQLError('Must be a date-time in RFC 3339 format');
};

const isDate = (value: string) => {
  if (isISO8601(value)) return true;

  throw new GraphQLError('Must be a date in ISO 8601 format');
};

const isEmail = (value: string) => {
  if (isEmailValidator(value)) return true;

  throw new GraphQLError('Must be in email format');
};

const isIPv4 = (value: string) => {
  if (isIP(value, 4)) return true;

  throw new GraphQLError('Must be in IP v4 format');
};

const isIPv6 = (value: string) => {
  if (isIP(value, 6)) return true;

  throw new GraphQLError('Must be in IP v6 format');
};

const isURI = (value: string) => {
  if (isURL(value)) return true;
  throw new GraphQLError('Must be in URI format');
};

const isUUID = (value: string) => {
  if (isUUIDValidator(value)) return true;

  throw new GraphQLError('Must be in UUID format');
};

export default {
  byte: isByte,
  datetime: isDateTime,
  date: isDate,
  email: isEmail,
  ipv4: isIPv4,
  ipv6: isIPv6,
  url: isURI,
  uuid: isUUID,
};
