import {
  CloudFormation,
  waitUntilStackCreateComplete,
} from "@aws-sdk/client-cloudformation";

const template = {
  AWSTemplateFormatVersion: "2010-09-09",

  Description: "Create a project EC2 within a Custom VPC",

  Parameters: {
    StackName: {
      Type: "String",
      Default: "ProjectInstance",
      Description: "Name for the CloudFormation stack",
    },

    InstanceType: {
      Description: "EC2 instance type",
      Type: "String",
      Default: "t2.micro",
      AllowedValues: [
        "t1.micro",
        "t2.nano",
        "t2.micro",
        "t2.small",
        "t2.medium",
        "t2.large",
        "m1.small",
        "m1.medium",
        "m1.large",
        "m1.xlarge",
        "m2.xlarge",
        "m2.2xlarge",
        "m2.4xlarge",
        "m3.medium",
        "m3.large",
        "m3.xlarge",
        "m3.2xlarge",
        "m4.large",
        "m4.xlarge",
        "m4.2xlarge",
        "m4.4xlarge",
        "m4.10xlarge",
        "c1.medium",
        "c1.xlarge",
        "c3.large",
        "c3.xlarge",
        "c3.2xlarge",
        "c3.4xlarge",
        "c3.8xlarge",
        "c4.large",
        "c4.xlarge",
        "c4.2xlarge",
        "c4.4xlarge",
        "c4.8xlarge",
        "g2.2xlarge",
        "g2.8xlarge",
        "r3.large",
        "r3.xlarge",
        "r3.2xlarge",
        "r3.4xlarge",
        "r3.8xlarge",
        "i2.xlarge",
        "i2.2xlarge",
        "i2.4xlarge",
        "i2.8xlarge",
        "d2.xlarge",
        "d2.2xlarge",
        "d2.4xlarge",
        "d2.8xlarge",
        "hi1.4xlarge",
        "hs1.8xlarge",
        "cr1.8xlarge",
        "cc2.8xlarge",
        "cg1.4xlarge",
      ],
      ConstraintDescription: "must be a valid EC2 instance type.",
    },

    KeyName: {
      Description:
        "Name of an existing EC2 KeyPair to enable SSH access to the instance",
      Type: "AWS::EC2::KeyPair::KeyName",
      Default: "MyKeyPair",
      ConstraintDescription: "must be the name of an existing EC2 KeyPair.",
    },

    SSHLocation: {
      Description:
        " The IP address range that can be used to SSH to the EC2 instances",
      Type: "String",
      MinLength: "9",
      MaxLength: "18",
      Default: "0.0.0.0/0",
      AllowedPattern:
        "(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(\\d{1,2})",
      ConstraintDescription:
        "must be a valid IP CIDR range of the form x.x.x.x/x.",
    },
  },

  Mappings: {
    Region2Examples: {
      "ap-east-1": {
        Examples:
          "https://s3-ap-east-1.amazonaws.com/cloudformation-examples-ap-east-1",
      },
      "ap-northeast-1": {
        Examples:
          "https://s3-ap-northeast-1.amazonaws.com/cloudformation-examples-ap-northeast-1",
      },
      "ap-northeast-2": {
        Examples:
          "https://s3-ap-northeast-2.amazonaws.com/cloudformation-examples-ap-northeast-2",
      },
      "ap-northeast-3": {
        Examples:
          "https://s3-ap-northeast-3.amazonaws.com/cloudformation-examples-ap-northeast-3",
      },
      "ap-south-1": {
        Examples:
          "https://s3-ap-south-1.amazonaws.com/cloudformation-examples-ap-south-1",
      },
      "ap-southeast-1": {
        Examples:
          "https://s3-ap-southeast-1.amazonaws.com/cloudformation-examples-ap-southeast-1",
      },
      "ap-southeast-2": {
        Examples:
          "https://s3-ap-southeast-2.amazonaws.com/cloudformation-examples-ap-southeast-2",
      },
      "ca-central-1": {
        Examples:
          "https://s3-ca-central-1.amazonaws.com/cloudformation-examples-ca-central-1",
      },
      "cn-north-1": {
        Examples:
          "https://s3.cn-north-1.amazonaws.com.cn/cloudformation-examples-cn-north-1",
      },
      "cn-northwest-1": {
        Examples:
          "https://s3.cn-northwest-1.amazonaws.com.cn/cloudformation-examples-cn-northwest-1",
      },
      "eu-central-1": {
        Examples:
          "https://s3-eu-central-1.amazonaws.com/cloudformation-examples-eu-central-1",
      },
      "eu-north-1": {
        Examples:
          "https://s3-eu-north-1.amazonaws.com/cloudformation-examples-eu-north-1",
      },
      "eu-west-1": {
        Examples:
          "https://s3-eu-west-1.amazonaws.com/cloudformation-examples-eu-west-1",
      },
      "eu-west-2": {
        Examples:
          "https://s3-eu-west-2.amazonaws.com/cloudformation-examples-eu-west-2",
      },
      "eu-west-3": {
        Examples:
          "https://s3-eu-west-3.amazonaws.com/cloudformation-examples-eu-west-3",
      },
      "me-south-1": {
        Examples:
          "https://s3-me-south-1.amazonaws.com/cloudformation-examples-me-south-1",
      },
      "sa-east-1": {
        Examples:
          "https://s3-sa-east-1.amazonaws.com/cloudformation-examples-sa-east-1",
      },
      "us-east-1": {
        Examples: "https://s3.amazonaws.com/cloudformation-examples-us-east-1",
      },
      "us-east-2": {
        Examples:
          "https://s3-us-east-2.amazonaws.com/cloudformation-examples-us-east-2",
      },
      "us-west-1": {
        Examples:
          "https://s3-us-west-1.amazonaws.com/cloudformation-examples-us-west-1",
      },
      "us-west-2": {
        Examples:
          "https://s3-us-west-2.amazonaws.com/cloudformation-examples-us-west-2",
      },
    },
    AWSInstanceType2Arch: {
      "t1.micro": { Arch: "HVM64" },
      "t2.nano": { Arch: "HVM64" },
      "t2.micro": { Arch: "HVM64" },
      "t2.small": { Arch: "HVM64" },
      "t2.medium": { Arch: "HVM64" },
      "t2.large": { Arch: "HVM64" },
      "m1.small": { Arch: "HVM64" },
      "m1.medium": { Arch: "HVM64" },
      "m1.large": { Arch: "HVM64" },
      "m1.xlarge": { Arch: "HVM64" },
      "m2.xlarge": { Arch: "HVM64" },
      "m2.2xlarge": { Arch: "HVM64" },
      "m2.4xlarge": { Arch: "HVM64" },
      "m3.medium": { Arch: "HVM64" },
      "m3.large": { Arch: "HVM64" },
      "m3.xlarge": { Arch: "HVM64" },
      "m3.2xlarge": { Arch: "HVM64" },
      "m4.large": { Arch: "HVM64" },
      "m4.xlarge": { Arch: "HVM64" },
      "m4.2xlarge": { Arch: "HVM64" },
      "m4.4xlarge": { Arch: "HVM64" },
      "m4.10xlarge": { Arch: "HVM64" },
      "c1.medium": { Arch: "HVM64" },
      "c1.xlarge": { Arch: "HVM64" },
      "c3.large": { Arch: "HVM64" },
      "c3.xlarge": { Arch: "HVM64" },
      "c3.2xlarge": { Arch: "HVM64" },
      "c3.4xlarge": { Arch: "HVM64" },
      "c3.8xlarge": { Arch: "HVM64" },
      "c4.large": { Arch: "HVM64" },
      "c4.xlarge": { Arch: "HVM64" },
      "c4.2xlarge": { Arch: "HVM64" },
      "c4.4xlarge": { Arch: "HVM64" },
      "c4.8xlarge": { Arch: "HVM64" },
      "g2.2xlarge": { Arch: "HVMG2" },
      "g2.8xlarge": { Arch: "HVMG2" },
      "r3.large": { Arch: "HVM64" },
      "r3.xlarge": { Arch: "HVM64" },
      "r3.2xlarge": { Arch: "HVM64" },
      "r3.4xlarge": { Arch: "HVM64" },
      "r3.8xlarge": { Arch: "HVM64" },
      "i2.xlarge": { Arch: "HVM64" },
      "i2.2xlarge": { Arch: "HVM64" },
      "i2.4xlarge": { Arch: "HVM64" },
      "i2.8xlarge": { Arch: "HVM64" },
      "d2.xlarge": { Arch: "HVM64" },
      "d2.2xlarge": { Arch: "HVM64" },
      "d2.4xlarge": { Arch: "HVM64" },
      "d2.8xlarge": { Arch: "HVM64" },
      "hi1.4xlarge": { Arch: "HVM64" },
      "hs1.8xlarge": { Arch: "HVM64" },
      "cr1.8xlarge": { Arch: "HVM64" },
      "cc2.8xlarge": { Arch: "HVM64" },
    },

    AWSInstanceType2NATArch: {
      "t1.micro": { Arch: "NATHVM64" },
      "t2.nano": { Arch: "NATHVM64" },
      "t2.micro": { Arch: "NATHVM64" },
      "t2.small": { Arch: "NATHVM64" },
      "t2.medium": { Arch: "NATHVM64" },
      "t2.large": { Arch: "NATHVM64" },
      "m1.small": { Arch: "NATHVM64" },
      "m1.medium": { Arch: "NATHVM64" },
      "m1.large": { Arch: "NATHVM64" },
      "m1.xlarge": { Arch: "NATHVM64" },
      "m2.xlarge": { Arch: "NATHVM64" },
      "m2.2xlarge": { Arch: "NATHVM64" },
      "m2.4xlarge": { Arch: "NATHVM64" },
      "m3.medium": { Arch: "NATHVM64" },
      "m3.large": { Arch: "NATHVM64" },
      "m3.xlarge": { Arch: "NATHVM64" },
      "m3.2xlarge": { Arch: "NATHVM64" },
      "m4.large": { Arch: "NATHVM64" },
      "m4.xlarge": { Arch: "NATHVM64" },
      "m4.2xlarge": { Arch: "NATHVM64" },
      "m4.4xlarge": { Arch: "NATHVM64" },
      "m4.10xlarge": { Arch: "NATHVM64" },
      "c1.medium": { Arch: "NATHVM64" },
      "c1.xlarge": { Arch: "NATHVM64" },
      "c3.large": { Arch: "NATHVM64" },
      "c3.xlarge": { Arch: "NATHVM64" },
      "c3.2xlarge": { Arch: "NATHVM64" },
      "c3.4xlarge": { Arch: "NATHVM64" },
      "c3.8xlarge": { Arch: "NATHVM64" },
      "c4.large": { Arch: "NATHVM64" },
      "c4.xlarge": { Arch: "NATHVM64" },
      "c4.2xlarge": { Arch: "NATHVM64" },
      "c4.4xlarge": { Arch: "NATHVM64" },
      "c4.8xlarge": { Arch: "NATHVM64" },
      "g2.2xlarge": { Arch: "NATHVMG2" },
      "g2.8xlarge": { Arch: "NATHVMG2" },
      "r3.large": { Arch: "NATHVM64" },
      "r3.xlarge": { Arch: "NATHVM64" },
      "r3.2xlarge": { Arch: "NATHVM64" },
      "r3.4xlarge": { Arch: "NATHVM64" },
      "r3.8xlarge": { Arch: "NATHVM64" },
      "i2.xlarge": { Arch: "NATHVM64" },
      "i2.2xlarge": { Arch: "NATHVM64" },
      "i2.4xlarge": { Arch: "NATHVM64" },
      "i2.8xlarge": { Arch: "NATHVM64" },
      "d2.xlarge": { Arch: "NATHVM64" },
      "d2.2xlarge": { Arch: "NATHVM64" },
      "d2.4xlarge": { Arch: "NATHVM64" },
      "d2.8xlarge": { Arch: "NATHVM64" },
      "hi1.4xlarge": { Arch: "NATHVM64" },
      "hs1.8xlarge": { Arch: "NATHVM64" },
      "cr1.8xlarge": { Arch: "NATHVM64" },
      "cc2.8xlarge": { Arch: "NATHVM64" },
    },
    AWSRegionArch2AMI: {
      "af-south-1": {
        HVM64: "ami-064cc455f8a1ef504",
        HVMG2: "NOT_SUPPORTED",
      },
      "ap-east-1": { HVM64: "ami-f85b1989", HVMG2: "NOT_SUPPORTED" },
      "ap-northeast-1": {
        HVM64: "ami-0b2c2a754d5b4da22",
        HVMG2: "ami-09d0e0e099ecabba2",
      },
      "ap-northeast-2": {
        HVM64: "ami-0493ab99920f410fc",
        HVMG2: "NOT_SUPPORTED",
      },
      "ap-northeast-3": {
        HVM64: "ami-01344f6f63a4decc1",
        HVMG2: "NOT_SUPPORTED",
      },
      "ap-south-1": {
        HVM64: "ami-03cfb5e1fb4fac428",
        HVMG2: "ami-0244c1d42815af84a",
      },
      "ap-southeast-1": {
        HVM64: "ami-0ba35dc9caf73d1c7",
        HVMG2: "ami-0e46ce0d6a87dc979",
      },
      "ap-southeast-2": {
        HVM64: "ami-0ae99b503e8694028",
        HVMG2: "ami-0c0ab057a101d8ff2",
      },
      "ca-central-1": {
        HVM64: "ami-0803e21a2ec22f953",
        HVMG2: "NOT_SUPPORTED",
      },
      "cn-north-1": {
        HVM64: "ami-07a3f215cc90c889c",
        HVMG2: "NOT_SUPPORTED",
      },
      "cn-northwest-1": {
        HVM64: "ami-0a3b3b10f714a0ff4",
        HVMG2: "NOT_SUPPORTED",
      },
      "eu-central-1": {
        HVM64: "ami-0474863011a7d1541",
        HVMG2: "ami-0aa1822e3eb913a11",
      },
      "eu-north-1": {
        HVM64: "ami-0de4b8910494dba0f",
        HVMG2: "ami-32d55b4c",
      },
      "eu-south-1": {
        HVM64: "ami-08427144fe9ebdef6",
        HVMG2: "NOT_SUPPORTED",
      },
      "eu-west-1": {
        HVM64: "ami-015232c01a82b847b",
        HVMG2: "ami-0d5299b1c6112c3c7",
      },
      "eu-west-2": {
        HVM64: "ami-0765d48d7e15beb93",
        HVMG2: "NOT_SUPPORTED",
      },
      "eu-west-3": {
        HVM64: "ami-0caf07637eda19d9c",
        HVMG2: "NOT_SUPPORTED",
      },
      "me-south-1": {
        HVM64: "ami-0744743d80915b497",
        HVMG2: "NOT_SUPPORTED",
      },
      "sa-east-1": {
        HVM64: "ami-0a52e8a6018e92bb0",
        HVMG2: "NOT_SUPPORTED",
      },
      "us-east-1": {
        HVM64: "ami-032930428bf1abbff",
        HVMG2: "ami-0aeb704d503081ea6",
      },
      "us-east-2": {
        HVM64: "ami-097a2df4ac947655f",
        HVMG2: "NOT_SUPPORTED",
      },
      "us-west-1": {
        HVM64: "ami-0f8e81a3da6e2510a",
        HVMG2: "ami-0a7fc72dc0e51aa77",
      },
      "us-west-2": {
        HVM64: "ami-01fee56b22f308154",
        HVMG2: "ami-0fe84a5b4563d8f27",
      },
    },
  },

  Resources: {
    ProjectInstance: {
      Type: "AWS::EC2::Instance",
      CreationPolicy: {
        ResourceSignal: {
          Timeout: "PT10M",
          Count: "1",
        },
      },
      Metadata: {
        "AWS::CloudFormation::Init": {
          configSets: {
            full_install: ["install_and_enable_cfn_hup"],
          },
          install_and_enable_cfn_hup: {
            files: {
              "/etc/cfn/cfn-hup.conf": {
                content: {
                  "Fn::Join": [
                    "",
                    [
                      "[main]\n",
                      "stack=",
                      {
                        Ref: "AWS::StackId",
                      },
                      "\n",
                      "region=",
                      {
                        Ref: "AWS::Region",
                      },
                      "\n",
                    ],
                  ],
                },
                mode: "000400",
                owner: "root",
                group: "root",
              },
              "/etc/cfn/hooks.d/cfn-auto-reloader.conf": {
                content: {
                  "Fn::Join": [
                    "",
                    [
                      "[cfn-auto-reloader-hook]\n",
                      "triggers=post.update\n",
                      "path=Resources.WebServerInstance.Metadata.AWS::CloudFormation::Init\n",
                      "action=/opt/aws/bin/cfn-init -v ",
                      "         --stack ",
                      {
                        Ref: "AWS::StackName",
                      },
                      "         --resource WebServerInstance ",
                      "         --configsets InstallAndRun ",
                      "         --region ",
                      {
                        Ref: "AWS::Region",
                      },
                      "\n",
                      "runas=root\n",
                    ],
                  ],
                },
                mode: "000400",
                owner: "root",
                group: "root",
              },
              "/lib/systemd/system/cfn-hup.service": {
                content: {
                  "Fn::Join": [
                    "",
                    [
                      "[Unit]\n",
                      "Description=cfn-hup daemon\n\n",
                      "[Service]\n",
                      "Type=simple\n",
                      "ExecStart=/usr/local/bin/cfn-hup\n",
                      "Restart=always\n\n",
                      "[Install]\n",
                      "WantedBy=multi-user.target",
                    ],
                  ],
                },
              },
            },
            commands: {
              "01enable_cfn_hup": {
                command: "systemctl enable cfn-hup.service",
              },
              "02start_cfn_hup": {
                command: "systemctl start cfn-hup.service",
              },
            },
          },
        },
      },
      Properties: {
        ImageId: {
          "Fn::FindInMap": [
            "AWSRegionArch2AMI",
            { Ref: "AWS::Region" },
            {
              "Fn::FindInMap": [
                "AWSInstanceType2Arch",
                { Ref: "InstanceType" },
                "Arch",
              ],
            },
          ],
        },
        InstanceType: { Ref: "InstanceType" },
        KeyName: { Ref: "KeyName" },
        Tags: [
          { Key: "Application", Value: { Ref: "AWS::StackId" } },
          { Key: "Name", Value: "ProjectInstance" },
        ],
        NetworkInterfaces: [
          {
            GroupSet: [{ "Fn::ImportValue": "SecurityGroupId" }],
            AssociatePublicIpAddress: "true",
            DeviceIndex: "0",
            DeleteOnTermination: "true",
            SubnetId: { "Fn::ImportValue": "ProjectSubnetId" },
          },
        ],
        UserData: {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "#!/bin/bash -xe\n",
                "sudo apt-get update -y\n",
                "sudo apt-get -y install python3-pip\n",
                "mkdir -p /opt/aws/\n",
                "sudo pip3 install https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-py3-latest.tar.gz\n",
                "sudo ln -s /usr/local/init/ubuntu/cfn-hup /etc/init.d/cfn-hup\n",
                "/usr/local/bin/cfn-init -v ",
                "         --stack ",
                {
                  Ref: "AWS::StackName",
                },
                "         --resource ProjectInstance ",
                "         --configsets full_install ",
                "         --region ",
                {
                  Ref: "AWS::Region",
                },
                "\n",
                "/usr/local/bin/cfn-signal -e $? ",
                "         --stack ",
                {
                  Ref: "AWS::StackName",
                },
                "         --resource ProjectInstance ",
                "         --region ",
                {
                  Ref: "AWS::Region",
                },

                "\n",
                "sudo apt update\n",
                "sudo apt install apt-transport-https ca-certificates curl software-properties-common -y\n",
                "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg\n",
                'echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null\n',
                "sudo apt update\n",
                "apt-cache policy docker-ce\n",
                "sudo apt install -y docker-ce\n",
                "mkdir -p ~/.docker/project-plugins/\n",
                "curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/project-plugins/docker-compose\n",
                "chmod +x ~/.docker/project-plugins/docker-compose\n",
                "sudo -u ubuntu sh -c 'cd ~ && sudo git clone https://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@github.com/Nodel-Recall/tinker-admin-app.git && cd tinker-admin-app/src/services/docker && sudo docker compose up -d'\n",
              ],
            ],
          },
        },
      },
    },
  },

  Outputs: {
    URL: {
      Value: {
        "Fn::Join": [
          "",
          ["http://", { "Fn::GetAtt": ["ProjectInstance", "PublicIp"] }],
        ],
      },
      Description: "Newly created application URL",
    },
  },
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
  const templateJson = JSON.stringify(template);
  const cloudFormation = new CloudFormation();
  const stackParams = {
    StackName: stackName,
    TemplateBody: templateJson,
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