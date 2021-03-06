const express = require("express");
const router = express.Router();
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const { find } = require("lodash");

const db = require("../data/db");
const courseListCollection = db.courseList;

router.get("/", (req, res, next) => {
  const result = find(courseListCollection);
  res.json({
    data: result
  });
});

router.get("/getList/:id?", (req, res, next) => {
  if (!req.params.id) {
    return next(new BadRequestError("VALIDATION", "Missing id"));
  }

  if (isNaN(req.params.id)) {
    return next(new BadRequestError("VALIDATION", "Id not a number"));
  }

  const Id = +req.params.id;

  const currList = find(courseListCollection, { id: Id });

  if (currList === undefined) {
    return next(
      new NotFoundError("VALIDATION", "courseList with id " + Id + " not found")
    );
  }

  res.json({
    data: currList
  });
});

router.post("/", (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError("VALIDATION", "Missing name"));
  }

  const name = req.body.name;

  // Check for name uniqueness
  const result = find(courseListCollection, { name });
  if (result) {
    return next(new BadRequestError("VALIDATION", "Name should be unique"));
  }

  const newCourseList = {
    id: courseListCollection.length + 1,
    name
  };

  courseListCollection.push(newCourseList);

  res.json({
    data: newCourseList
  });
});

router.delete("/delete/:id?", (req, res, next) => {
  if (!req.params.id) {
    return next(new BadRequestError("VALIDATION", "Missing id"));
  }

  if (isNaN(req.params.id)) {
    return next(new BadRequestError("VALIDATION", "Id not a number"));
  }

  const Id = +req.params.id;
  // found courses by id
  const i = courseListCollection.findIndex(x => x.id === Id);

  courseListCollection.splice(i, 1);

  res.json({
    data: courseListCollection
  });
});

module.exports = router;
