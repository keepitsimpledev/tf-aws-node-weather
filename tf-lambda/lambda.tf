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

resource "aws_lambda_function" "weather_lambda" {
  filename      = "build/lambda_weather_function.zip"
  function_name = "fetch_weather"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.lambdaHandler"
  timeout       = 30 # TODO: reconsider value

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs22.x"

  # vpc_config {
  #   subnet_ids         = [aws_elasticache_cluster.subnet_id]
  #   security_group_ids = [aws_elasticache_cluster.security_group_ids]
  # }

  environment {
    variables = {
      cache_host = aws_elasticache_cluster.project_cache.cache_nodes[0].address
      cache_port = aws_elasticache_cluster.project_cache.port
      # TODO: implement
      cache_username = ""
      cache_auth_token = ""
    }
  }
}
