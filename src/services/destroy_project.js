const { CloudFormation } = require("@aws-sdk/client-cloudformation");

export const destroyProject = (name) => {
  const cloudFormation = new CloudFormation();
  const stackParams = {
    StackName: name,
  };

  cloudFormation.deleteStack(stackParams, (err, data) => {
    if (err) {
      console.error("Error creating stack:", err);
      process.exit(1);
    } else {
      console.log("Stack deletion initiated:", name);
      process.exit(0);
    }
  });
};
