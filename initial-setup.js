const readline = require("readline/promises");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const data = {
  directories: [
    "./",
    "./server",
    "./server/controllers",
    "./server/helpers",
    "./server/models",
    "./server/routes",
    "./server/routes/__test__",
    "./server/test",
    "./server/validators",
  ],
  files: [
    "Dockerfile",
    ".dockerignore",
    "package-lock.json",
    "package.json",
    "tsconfig.json",
    "server/app.ts",
    "server/index.ts",
    "server/test/setup.ts",
  ],
};

/*
TODO: To do everything in a for
const data = [
  { path: "./", type: "directory" },
  { path: "./server", type: "directory" },
  { path: "Dockerfile", type: "file" },
  { path: ".dockerignore", type: "file" }
]
*/

async function input() {
  try {
    const service = await rl.question("Name of the new service?");

    if (service.length < 4) throw new Error("Service must be bigger than 3");

    console.log("Setting new proyect up...");

    // Create new directories->
    for (const directory of data.directories) {
      try {
        const filePath = path.join(service, directory);

        if (fs.existsSync(filePath)) {
          console.log("Directory already exists!", filePath);
          continue;
        }

        await fs.promises.mkdir(filePath);
        console.log("Directory created!", filePath);
      } catch (error) {
        throw new Error(error);
      }
    }

    // Copy/clone files ->
    for (const file of data.files) {
      try {
        const content = fs.readFileSync(path.join("auth", file), "utf-8"); // Main file content to copy
        const filePath = path.join(service, file);

        if (fs.existsSync(filePath)) {
          console.log("File already exists!", filePath);
          continue;
        }

        await fs.promises.writeFile(filePath, content);
        console.log("File created!", filePath);
      } catch (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    console.error("Error setting up the project:", error);
  } finally {
    rl.close();
  }
}

input();
