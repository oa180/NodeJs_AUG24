const fs = require("fs");
const superAgent = require("superagent");

const server = require("http").createServer();

const readFileAsPromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject("Could not read from file");
      }
      resolve(data);
    });
  });
};

const writeFileAsPromise = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
      if (err) {
        reject("Could not write on file");
      }

      resolve("successful");
    });
  });
};

// readFileAsPromise(`${__dirname}/dev-data/breed.txt`)
//   .then((data) => {
//     return superAgent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     return writeFileAsPromise(
//       `${__dirname}/dev-data/dog-image.txt`,
//       res.body.message
//     );
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   })
//   .finally(() => {
//     console.log("finally");
//   });

const getDogImage = async () => {
  try {
    const dogBreed = await readFileAsPromise(`${__dirname}/dev-data/breed.txt`);
    const dogImageLink = await superAgent.get(
      `https://dog.ceo/api/breed/${dogBreed}/images/random`
    );
    await writeFileAsPromise(
      `${__dirname}/dev-data/dog-image.txt`,
      dogImageLink.body.message
    );
  } catch (error) {
    console.log(error.message);
  }

  return "Omar";
};

// console.log(getDogImage());

// getDogImage().then((res) => {
//   console.log(res);
// });

// function x() {
//   console.log("hello");
//   //   return "bye";
// }
// x();

(async () => {
  const myVal = await getDogImage();
  console.log(myVal);
})();

// const myValue = x();
// console.log(myValue);

// server.on("request", (req, res) => {

// });

// console.log(__dirname);
server.listen("3000", () => {
  console.log("Server is running on port 3000");
});
