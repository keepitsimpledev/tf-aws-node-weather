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
    region = "eu-north-1"
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = local.region
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
  filename      = "build/lambda_weather_function.zip"
  function_name = "fetch_weather"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.lambdaHandler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs22.x"
}
