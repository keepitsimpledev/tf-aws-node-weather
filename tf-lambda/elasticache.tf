# ~20m to destroy
resource "aws_security_group" "cache_sg" {
  name        = "cache-security-group"
  description = "Security group for Redis cluster"

  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  apply_immediately    = true
  port                 = 6379

  subnet_group_name    = aws_elasticache_subnet_group.default.name
  security_group_ids   = [
    aws_security_group.cache_sg.id,
    aws_default_security_group.default_security_group.id
  ]

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.cache_logs.name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }
}

resource "aws_cloudwatch_log_group" "cache_logs" {
  name              = "cache-logs"
  retention_in_days = 14

  tags = {
    Environment = "dev"
    Application = "node-weather"
  }
}
