import fs from "fs";

const envVariables = ["API"];

let envContent = "";

envVariables.forEach((variable) => {
  if (process.env[variable]) {
    envContent += `VITE_${variable}=${process.env[variable]}\n`;
  } else if (variable === "API") {
    envContent += `VITE_${variable}=http://localhost:43000\n`;
  }
});

fs.writeFileSync(".env", envContent);
