const taskSchema = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    estimated_days: {
      type: "number",
      min: 0
    }
  },
  required: ["name", "description", "estimated_days"]
};

const taskListSchema = {
  type: "array",
  items: taskSchema,
  uniqueItemProperties: ['name']
};

export {
  taskSchema as schema,
  taskListSchema as list
};
