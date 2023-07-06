import { CloudFormation } from "@aws-sdk/client-cloudformation";
import fs from "fs";

const templatePath = "./new_project_CF.json";

export const createProject = (projectName) => {
  const cloudformation = new CloudFormation();

  fs.readFile(templatePath, "utf8", (err, template) => {
    if (err) {
      console.error("Error reading template file:", err);
      process.exit(1);
    }

    const stackParams = {
      StackName: projectName,
      TemplateBody: template,
    };

    cloudformation.createStack(stackParams, (err, data) => {
      if (err) {
        console.error("Error creating stack:", err);
        process.exit(1);
      } else {
        console.log("Stack creation initiated:", data.StackId);
        process.exit(0);
      }
    });
  });
};
