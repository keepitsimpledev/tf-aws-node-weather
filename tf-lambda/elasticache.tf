# example from: https://dev.to/giasuddin90/creating-an-aws-elasticache-redis-cluster-using-terraform-eb6

resource "aws_security_group" "cache_sg" {
  name        = "cache-security-group"
  description = "Security group for Redis cluster"

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Open to all; consider restricting to specific IPs for better security
  }
}

# this take ~10m to apply, ~5m to destroy
resource "aws_elasticache_cluster" "project_cache" {
  cluster_id           = "project_cache_id"
  engine               = "redis"
  node_type            = "cache.t3.micro"  # Choose a suitable instance type based on your needs
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"  # Using Redis 7.0 parameter group
  engine_version       = "7.0"             # Specify the Redis engine version
  apply_immediately    = true
  port                 = 6379

  security_group_ids   = [aws_security_group.cache_sg.id]  # Associate the Redis cluster with the custom security group
}
