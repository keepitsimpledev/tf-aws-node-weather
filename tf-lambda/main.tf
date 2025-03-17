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
  # should i do this?:
  # access_key = "your-access-key"
  # secret_key = "your-secret-key"
}

// TODO: consider modules?
