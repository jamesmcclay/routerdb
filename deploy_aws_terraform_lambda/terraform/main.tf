terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region  = "ap-northeast-1"
}

data "archive_file" "api_upload" {
  type        = "zip"
  source_file = "../../routerdb_flask/api.py"
  output_path = "../../tmp/api_upload.zip"
}

resource "aws_lambda_layer_version" "routerdb_layer" {
  filename   = "../../routerdb_flask/mylayer.zip"
  layer_name = "routerdb_layer"

  compatible_runtimes = ["python3.10"]
}

resource "aws_lambda_function" "routerdb_api" {
  function_name    = "routerdb_api"
  handler          = "api.lambda_handler"
  runtime          = "python3.10"
  filename         = "../../tmp/api_upload.zip"
  source_code_hash = data.archive_file.api_upload.output_base64sha256
  role             = aws_iam_role.dynamo_access_role.arn
  layers = [aws_lambda_layer_version.routerdb_layer.arn]

  environment {
    variables = {
      DYNAMO = "aws"
      ENVIRONMENT = "cloud"
    }
  }
}

resource "aws_lambda_function_url" "api_url" {
  function_name      = aws_lambda_function.routerdb_api.function_name
  authorization_type = "NONE"

}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "routers"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "routers"
  }
}

resource "aws_iam_role" "dynamo_access_role" {
  name = "dynamo_access_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "dynamo_access_policy" {
  name = "dynamo_access_policy"

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": [
                "${aws_dynamodb_table.basic-dynamodb-table.arn}"
            ]
        }
    ]
})
}

resource "aws_iam_policy_attachment" "dynamo_lambda_policy_attach" {
  name = "Policy Attachement"
  policy_arn = aws_iam_policy.dynamo_access_policy.arn
  roles       = [aws_iam_role.dynamo_access_role.name]
}

resource "aws_iam_instance_profile" "dynamo_instance_profile" {
  name = "dynamo_instance_profile"
  role = aws_iam_role.dynamo_access_role.name
}

resource "aws_s3_bucket" "react" {
  bucket = "jamesmcclay-react-routerdb"
  force_destroy = true

  tags = {
    Name        = "Router DB React"
  }
}

resource "aws_s3_bucket_website_configuration" "react-hosting" {
  bucket = aws_s3_bucket.react.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.react.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "react_bucket_policy" {
  bucket = aws_s3_bucket.react.id
  depends_on = [aws_s3_bucket_public_access_block.example]
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "${aws_s3_bucket.react.arn}/*"
        }
    ]
})
}
