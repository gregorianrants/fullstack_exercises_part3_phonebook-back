const mongoose = require("mongoose");
require("dotenv").config();

const CONNECTION_STRING = process.env.MONGODB_URI;

const personSchema = mongoose.Schema({
  name: { type: String, minLength: 3 },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+/.test(v) && v.length > 8;
      },
      message: (props) =>
        `number must have 2 or 3 digits before a hyphen and no less than 8 digits in total`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret["__v"];
    ret["id"] = ret["_id"].toString();
    delete ret["_id"];
  },
});

const Person = mongoose.model("Person", personSchema);

async function connect() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("connected to mongodb");
  } catch {
    console.log("failed to connect to mongo db");
  }
}

connect();

module.exports = Person;
