const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const personModel = require("./models/person.js");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

morgan.token("body", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms :body "));
app.use(express.static("dist"));

app.get("/info", async (req, res) => {
  const persons = await personModel.find({});

  const response = `
    <p>phone book has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `;
  res.send(response);
});

//fetchALL
app.get("/api/persons", async (req, res, next) => {
  try {
    let persons = await personModel.find({});
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

function propertyMissing({ obj, property }) {
  const errorMessage = "";
  if (!obj[property]) {
    return true;
  }
  if (obj[property].length === 0) {
    return true;
  }
}

//create

function localValidator(newPerson) {
  let errorMessages = [];
  if (propertyMissing({ obj: newPerson, property: "name" })) {
    errorMessages = [...errorMessages, "name is a required property"];
  }
  if (propertyMissing({ obj: newPerson, property: "number" }))
    errorMessages = [...errorMessages, "number is a required property"];
  return errorMessages;
}

app.post("/api/persons", async (req, res, next) => {
  const newPerson = req.body;
  let errorMessages = localValidator(newPerson);
  if (errorMessages.length > 0) {
    return res.status(400).json({ error: errorMessages.join(", ") });
  }
  const { name, number } = newPerson;
  try {
    const extantPerson = await personModel.findOne({ name });

    if (extantPerson) {
      return res.status(400).json({ error: "name must be unique" });
    }
    const newPerson = new personModel({ name, number });
    const createdPerson = await newPerson.save();

    res.status(200).json(createdPerson);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const person = await personModel.findByIdAndDelete(id);
    if (!person) {
      return res.status(404).send({
        error: "There is no person with the provided id",
      });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const person = await personModel.findById(id);

    if (!person) {
      //res.statusMessage = "Resource Not Found : there is no person with provided id"
      return res
        .status(404)
        .send({ error: "There is no person with the provided id" });
    }

    res.json(person);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;
  const updateData = { name, number };

  try {
    let updatedPerson = await personModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPerson) {
      res
        .status(404)
        .json({ error: "There is no person with the provided id" });
    }
    return res.status(200).json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

function errorHandler(err, req, res, next) {
  //console.log(JSON.stringify(err, null, 2));
  if (err.name == "CastError") {
    res.status(400).json({ error: "invalid id" });
  }
  if (err.name == "ValidationError") {
    res.status(400).json({ error: err.message });
  }
  return next(err);
}

app.use((req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

app.use(errorHandler);

//TODO change error messages to match course

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
