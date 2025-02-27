terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-north-1" // changed from Virginia to Stockholm
}

resource "aws_instance" "app_server" {
  // changed this because tutorial value wasn't found
  ami           = "ami-0e0d6e610ffe146fe" 
  instance_type = "t3.nano" // use a smaller one to ... save money?

  tags = {
    Name = "ExampleAppServerInstance"
  }
}
