const Joi = require("joi");
const mongoose = require("mongoose");

const ToDo = mongoose.model(
  "ToDos",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      minlength: 0,
      maxlength: 255,
      default: "No Description Provided",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dateCreated: { type: Date, default: Date.now },
    dateCompleted: {
      type: Date,
      required: function () {
        return this.isCompleted;
      },
      min: function () {
        return this.dateCreated;
      },
    },
  })
);

function validateToDo(toDo) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(0).max(255),
  });

  return schema.validate(toDo);
}

exports.ToDo = ToDo;
exports.validate = validateToDo;
