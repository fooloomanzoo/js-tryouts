/**
 * validates an object against an JSON-schema (for basic verification)
 * @param  {Object} schema The JSON-schema to validate against
 * @param  {any}    obj    An object that should be validated.
 * @return {boolean}       is `true` when the object is valid.
 */
function validate(schema, obj) {
  switch (schema.type) {
    case 'object':
      if (schema.required) {
        for (let prop of schema.required) {
          if (!obj[prop]) {
            return false;
          }
        }
      }
      if (schema.properties) {
        for (let prop in schema.properties) {
          return validate(schema.properties[prop], obj[prop]);
        }
      }
      break;
    case 'array':
      if (!schema.items) {
        return false;
      }
      if (obj.minLength > 0 && !obj.length) {
        // throw new Error('Array is too short')
        return false;
      }
      if (obj.maxLength < obj.length) {
        // throw new Error('Array is too long')
        return false;
      }
      for (let item of obj) {
        return validate(schema.items, item);
      }
      break;
    case 'string':
      if (schema.format) {
        if (schema.format === 'date') {
          if (isNaN(new Date(obj))) {
            return false;
          }
        }
      }
      break;
    case 'date':
      if (isNaN(new Date(obj))) {
        return false;
      }
      break;
    case 'number':
      if (isNaN(obj)) {
        return false;
      }
      if (schema.min > obj || schema.max < obj) {
        return false;
      }
      break;
    default:
      return false;
  }
  return true;
}

export default validate;
