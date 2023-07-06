const {
  CloudFormation,
  waitUntilStackCreateComplete,
} = require("@aws-sdk/client-cloudformation");

const fs = require("fs");
const util = require("util");

const templatePath = "./new_project_CF.json";
const encoding = "utf8";
const readFileAsync = util.promisify(fs.readFile);

const readTemplateFromFile = async (templatePath, encoding) => {
  try {
    let template = await readFileAsync(templatePath, encoding);
    return template;
  } catch (error) {
    console.log("Could not read the template file");
    process.exit(1);
  }
};

const promisifyCreateStack = async (cloudFormation, stackParams) => {
  return new Promise((resolve, reject) => {
    cloudFormation.createStack(stackParams, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const createStack = async (cloudFormation, stackParams) => {
  try {
    const data = await promisifyCreateStack(cloudFormation, stackParams);
  } catch (error) {
    console.log("Stack creation failed.");
    process.exit(1);
  }
};

const waitStack = async (cloudFormation, stackName) => {
  const waiterParams = {
    client: cloudFormation,
    maxWaitTime: 900,
  };

  const describeStacksCommandInput = {
    StackName: stackName,
  };

  try {
    await waitUntilStackCreateComplete(
      waiterParams,
      describeStacksCommandInput
    );
  } catch (error) {
    console.log("Timed out waiting for Stack to complete.");
    process.exit(1);
  }
};

const promisifyDescribeStack = async (cloudFormation, stackParams) => {
  return new Promise((resolve, reject) => {
    cloudFormation.describeStacks(stackParams, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const retrieveStackOutputs = async (cloudFormation, stackParams) => {
  try {
    let data = await promisifyDescribeStack(cloudFormation, stackParams);
    const outputs = data.Stacks[0].Outputs;

    const url = outputs.find((o) => o.OutputKey === "URL").OutputValue;
    return url;
  } catch (error) {
    console.log("Error returning the IP Address of the Project.");
    process.exit(1);
  }
};

export const createProject = async (stackName) => {
  const template = await readTemplateFromFile(templatePath, encoding);
  const cloudFormation = new CloudFormation();
  const stackParams = {
    StackName: stackName,
    TemplateBody: template,
  };

  try {
    await createStack(cloudFormation, stackParams);
    await waitStack(cloudFormation, stackName);
    const IPAddress = await retrieveStackOutputs(cloudFormation, stackParams);
    return IPAddress;
  } catch (e) {
    console.log("Failed attempting to retrieve Stack output.");
  }
};
