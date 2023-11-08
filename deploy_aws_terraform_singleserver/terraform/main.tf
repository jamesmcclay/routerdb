terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  #required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "ap-northeast-1"
}

resource "aws_security_group" "routerdb_sg" {
  name = "allow-all-sg"

  ingress {
      cidr_blocks = [
        "0.0.0.0/0"
      ]
      from_port = 22
      to_port = 22
      protocol = "tcp"
    }
  ingress {
      cidr_blocks = [
        "0.0.0.0/0"
      ]
      from_port = 80
      to_port = 80
      protocol = "tcp"
    }

  egress {
   from_port = 0
   to_port = 0
   protocol = "-1"
   cidr_blocks = ["0.0.0.0/0"]
 }
}

resource "aws_instance" "routerdb_server" {
  ami           = "ami-09937bb9852528c94"
  instance_type = "t2.micro"
  key_name      = "MacMini"

  vpc_security_group_ids= [aws_security_group.routerdb_sg.id]

  tags = {
    Name = "RouterDB-EverythingServer"
  }
}