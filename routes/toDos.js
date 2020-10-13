const { ToDo, validate } = require("../models/toDo");
const router = require("express").Router();
const _ = require("lodash");
const { isValidObjectId } = require("mongoose");

//For getting list of all todos sorted according to completion
router.get("/", async (req, res) => {
  let toDos = await ToDo.find()
    .sort("isCompleted")
    .select("_id title description dateCreated isCompleted dateCompleted");
  res.send(toDos);
});

router.get("/:id", async (req, res) => {
  let toDo = {};
  if (isValidObjectId(req.params.id)) {
    toDo = await ToDo.findById(req.params.id);
  } else {
    res.status(404).send("Provided ID is not a valid ObjectId");
  }

  if (!toDo)
    return res.status(404).send("The toDo with the given ID was not found.");
  toDo = _.pick(toDo, [
    "_id",
    "title",
    "description",
    "dateCreated",
    "isCompleted",
    "dateCompleted",
  ]);
  res.send(toDo);
});
// Adding new todo
router.post("/", async (req, res) => {
  console.log(req.body.title);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let toDo = new ToDo({
    title: req.body.title,
    description: req.body.description,
  });
  await toDo.save();
  toDo = _.pick(toDo, ["_id", "title", "description", "dateCreated"]);
  res.send(toDo);
});
// Updating  a todo
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let toDo = {};
  if (isValidObjectId(req.params.id)) {
    toDo = await ToDo.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
  } else {
    res.status(404).send("Provided ID is not a valid ObjectId");
  }

  if (!toDo)
    return res.status(404).send("The toDo with the given ID was not found.");
  toDo = _.pick(toDo, [
    "_id",
    "title",
    "description",
    "dateCreated",
    "isCompleted",
    "dateCompleted",
  ]);
  res.send(toDo);
});
//Marking a todo complete
router.patch("/:id", async (req, res) => {
  let toDo = {};
  if (isValidObjectId(req.params.id)) {
    toDo = await ToDo.findById(req.params.id);
  } else {
    res.status(404).send("Provided ID is not a valid ObjectId");
  }
  if (!toDo)
    return res.status(404).send("The toDo with the given ID was not found.");

  if (toDo.isCompleted) {
    res.send(
      `This Todo has been already been completed at ${toDo.dateCompleted}`
    );
  } else {
    toDo.isCompleted = true;
    toDo.dateCompleted = new Date();
    await toDo.save();
    res.send(`Todo with id ${toDo._id} has been marked completed`);
  }
});
router.delete("/:id", async (req, res) => {
  let toDo = {};
  if (isValidObjectId(req.params.id)) {
    toDo = await ToDo.findByIdAndRemove(req.params.id);
  } else {
    res.status(404).send("Provided ID is not a valid ObjectId");
  }

  if (!toDo)
    return res.status(404).send("The toDo with the given ID was not found.");

  res.send(`Todo with id ${toDo._id} has been deleted from database`);
});
module.exports = router;
