import projectSchema from './project.schema.js';

let employeeSchema = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    lastname: {
      type: "string"
    },
    projects: {
      type: "array",
      items: projectSchema,
      maxItems: 3
    }
  },
  required: ["name", "lastname"]
};

employeeSchema.supervisor = employeeSchema;

let employeeListSchema = {
  type: "array",
  items: employeeSchema,
  uniqueItemProperties: ['name', 'lastname']
};

export {
  employeeSchema as schema,
  employeeListSchema as list
};
