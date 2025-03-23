# examples from https://dev.to/giasuddin90/creating-an-aws-elasticache-redis-cluster-using-terraform-eb6
# and https://github.com/udaysharma/terraform-aws-redis-lambda/tree/master
resource "aws_security_group" "cache_sg" {
  name        = "cache-security-group"
  description = "Security group for Redis cluster"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Open to all; consider restricting to specific IPs for better security
  }
}

resource "aws_elasticache_subnet_group" "default" {
  name        = "cache-subnet-group"
  subnet_ids  = [aws_subnet.subnet_private.id]
}

# this take ~10m to apply, ~5m to destroy
resource "aws_elasticache_cluster" "project_cache" {
  cluster_id           = "project-cache-id"
  engine               = "redis"
  node_type            = "cache.t3.micro"  # Choose a suitable instance type based on your needs
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"  # Using Redis 7.0 parameter group
  engine_version       = "7.0"             # Specify the Redis engine version
  apply_immediately    = true
  port                 = 6379

  subnet_group_name    = aws_elasticache_subnet_group.default.name
  security_group_ids   = [aws_security_group.cache_sg.id]

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.cache_logs.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }
}

resource "aws_cloudwatch_log_group" "cache_logs" {
  name = "cache-logs"

  tags = {
    Environment = "dev"
    Application = "node-weather"
  }
}

# consider: https://github.com/terraform-aws-modules/terraform-aws-lambda/blob/v7.20.1/examples/with-vpc/main.tf