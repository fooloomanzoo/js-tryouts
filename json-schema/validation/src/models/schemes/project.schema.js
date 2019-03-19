import taskListSchema from './task.schema.js';

const projectSchema = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    start_date: {
      type: "date"
    },
    end_date: {
      type: "date"
    },
    slack_time: {
      type: "number",
      min: 0
    },
    tasks: taskListSchema
  },
  required: ["name", "slack_time"]
};

const projectListSchema = {
  type: "array",
  items: projectSchema,
  uniqueItemProperties: ['name']
};

export {
  projectSchema as schema,
  projectListSchema as list
};
