const { execFile } = require("child_process");
const process = require("process");

const url = "http://localhost/sitenizar/home.html";

const commands = {
  win32: ["cmd", ["/c", "start", "", url]],
  darwin: ["open", [url]],
  linux: ["xdg-open", [url]],
};

const command = commands[process.platform];

if (!command) {
  console.log(url);
  process.exit(0);
}

execFile(command[0], command[1], (error) => {
  if (error) {
    console.log(url);
    process.exit(0);
  }
});
