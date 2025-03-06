terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # this bucket is not managed in this project - it was manually created
  backend "s3" {
    bucket = "kis-node-weather"
    key    = "terraform/state"
    region = "eu-north-1" # TODO: move to tfvars
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-north-1"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "../node-weather/dist/src/"  
  output_path = "build/lambda_weather_function.zip"
}

resource "aws_lambda_function" "test_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "build/lambda_weather_function.zip"
  function_name = "fetch_weather"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.lambdaHandler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs22.x"

#   environment {
#     variables = {
#       foo = "bar"
#     }
#   }
}
