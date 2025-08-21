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
    region = "eu-north-1" # ensure this is matches var.aws_region
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.env
      Application = local.application
    }
  }

}
