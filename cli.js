const { exec } = require("child_process");
exec("electron .", (err, stdout, stderr) => {
  if (err) {
    console.log("Could not execute electron. Is it installed?");
    console.log(stderr);
    return;
  }
});
