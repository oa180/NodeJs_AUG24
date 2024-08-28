const app = require("./app.js");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const dbAtlasString = process.env.DB.replace(
  "<password>",
  process.env.DB_PASSWORD
);
// const dbLocalString = "mongodb://localhost:27017";

mongoose
  .connect(dbAtlasString)
  .then((con) => {
    console.log("DB Connected Successfully...");
  })
  .catch((err) => {
    console.log(err.message);
  });

const portNumber = process.env.PORT || 8080;
app.listen(portNumber, () => {
  console.log(`Server is running on port ${portNumber}...`);
});
