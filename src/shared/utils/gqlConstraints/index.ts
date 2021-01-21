import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { SchemaDirectiveVisitor } from 'apollo-server';
import StringValidation from './scalars/StringValidation';
import NumberValidation from './scalars/NumberValidation';

class ConstraintDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: any) {
    this.wrapType(field);
  }
  visitFieldDefinition(field: any) {
    this.wrapType(field);
  }

  wrapType(field: any) {
    const fieldName = field.astNode.name.value;
    const type = field.type.ofType || field.type;
    const isNotNull = field.type instanceof GraphQLNonNull;
    const isScalarOfTypeString = type === GraphQLString;
    const isScalarOfTypeNumber = type === GraphQLInt || type === GraphQLFloat;

    if (!isScalarOfTypeString && !isScalarOfTypeNumber) {
      throw new Error(`Not a scalar of type ${type}`);
    }

    if (isScalarOfTypeString) {
      field.type = new StringValidation(fieldName, type, this.args);
    }

    if (isScalarOfTypeNumber) {
      field.type = new NumberValidation(fieldName, type, this.args);
    }

    if (isNotNull) {
      field.type = new GraphQLNonNull(field.type);
    }
  }
}

export default ConstraintDirective;
