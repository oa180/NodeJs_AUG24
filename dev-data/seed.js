const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const dbAtlasString = process.env.DB.replace(
  "<password>",
  process.env.DB_PASSWORD
);
// const dbLocalString = "mongodb://localhost:27017";
const fs = require("fs");

// const { importDataToDB, emptyDB } = require("./seed.js");
const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");

const obj = {
  user: { model: User, filePath: `${__dirname}/users.json` },
  product: { model: Product, filePath: `${__dirname}/products-list.json` },
  //   review: { model: Review, filePath: `${__dirname}/review.json` },
};

// SOLID Principles
// O => Open for extension and closed for modification

const list = JSON.parse(
  fs.readFileSync(obj[process.argv[3]].filePath, "utf-8")
);

const importDataToDB = (Model, list) => {
  console.log(Model);

  Model.create(list)
    .then((res) => {
      console.log("Data Imported successfully");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      process.exit();
    });
};

const emptyDB = (Model) => {
  Model.deleteMany()
    .then(() => {
      console.log("Database deleted successfully.");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      process.exit();
    });
};

if (process.argv[2] === "--import") {
  importDataToDB(obj[process.argv[3]].model, list);
} else if (process.argv[2] === "--delete") {
  emptyDB(obj[process.argv[3]].model);
}

mongoose
  .connect(dbAtlasString)
  .then((con) => {
    console.log("DB Connected Successfully...");
  })
  .catch((err) => {
    console.log(err.message);
  });
