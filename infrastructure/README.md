# SnackTrack AWS Infrastructure

This directory contains infrastructure configurations for deploying SnackTrack on AWS.

## Architecture

```
Client → CloudFront (optional) → AWS WAF → ALB → ECS Fargate → ElastiCache Redis
```

## Rate Limiting Strategy

### Two-Layer Defense

1. **AWS WAF (Edge Layer)** - Stops abuse before it hits your application
2. **FastAPI + Redis (App Layer)** - Enforces per-user limits

### Rate Limits

| Layer | Scope | Limit | WAF (5min) | Notes |
|-------|-------|-------|------------|-------|
| WAF | Unauth Global | 50/min/IP | 250 | Missing Authorization header |
| WAF | Auth Backstop | 400/min/IP | 2000 | Has Authorization header |
| WAF | Sensitive | 5/min/IP | 25 | /login, /register, /reset-password |
| WAF | Third-party Unauth | 15/min/IP | 75 | /recipes/search, /geocode, /nutrition |
| App | Authenticated | 150/min/user | - | Per user_id from JWT |
| App | Third-party Auth | 60/min/user | - | Per user_id from JWT |
| App | Unauth Fallback | 50/min/IP | - | Backup if WAF bypassed |

## Files

### `aws-waf-rules.json`

Complete WAF rule group configuration. To deploy:

```bash
# Create rule group
aws wafv2 create-rule-group \
  --name SnackTrack-WAF-RuleGroup \
  --scope REGIONAL \
  --capacity 500 \
  --rules file://aws-waf-rules.json \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=SnackTrack-WAF

# Create Web ACL and associate with ALB
aws wafv2 create-web-acl \
  --name SnackTrack-WebACL \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://web-acl-rules.json \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=SnackTrack-WebACL
```

## Environment Variables

Required for production:

```bash
# JWT
JWT_SECRET_KEY=your-256-bit-secret-key-here

# Redis (ElastiCache)
REDIS_HOST=your-elasticache-endpoint.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional, depends on ElastiCache config

# Third-party APIs
SPOONACULAR_API_KEY=your-spoonacular-key
GOOGLE_GEOCODING_API_KEY=your-google-key

# CORS (update with your domain)
CORS_ORIGINS=["https://snacktrack.yourdomain.com"]
```

## ECS Fargate Task Definition

```json
{
  "family": "snacktrack-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "snacktrack-api",
      "image": "your-ecr-repo/snacktrack-api:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "REDIS_HOST", "value": "your-elasticache-endpoint"},
        {"name": "CORS_ORIGINS", "value": "[\"https://snacktrack.yourdomain.com\"]"}
      ],
      "secrets": [
        {"name": "JWT_SECRET_KEY", "valueFrom": "arn:aws:secretsmanager:..."},
        {"name": "SPOONACULAR_API_KEY", "valueFrom": "arn:aws:secretsmanager:..."}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/snacktrack-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

## ElastiCache Redis Setup

1. Create ElastiCache Redis cluster (single-node for dev, cluster mode for prod)
2. Use same VPC as ECS tasks
3. Configure security group to allow port 6379 from ECS security group

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id snacktrack-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxx \
  --cache-subnet-group-name your-subnet-group
```

## Monitoring

### CloudWatch Alarms to Set Up

1. **429 Rate Alert**: Alarm when 429 responses exceed threshold
2. **Redis Connection Errors**: Monitor connection failures
3. **WAF Block Rate**: Track blocked requests by rule
4. **API Latency**: P99 response time

### WAF Logging

Enable WAF logging to CloudWatch Logs or S3:

```bash
aws wafv2 put-logging-configuration \
  --logging-configuration ResourceArn=arn:aws:wafv2:...,LogDestinationConfigs=arn:aws:logs:...
```

## Cost Estimates

| Service | Estimated Monthly Cost |
|---------|----------------------|
| ECS Fargate (2 tasks) | ~$30-50 |
| ElastiCache (t3.micro) | ~$15 |
| ALB | ~$20 |
| WAF (1M requests) | ~$6 |
| CloudWatch | ~$5 |
| **Total** | **~$75-100** |

## Security Checklist

- [ ] JWT_SECRET_KEY is unique and stored in Secrets Manager
- [ ] Redis is in private subnet, not publicly accessible
- [ ] ALB only accepts HTTPS traffic
- [ ] Security groups follow least privilege
- [ ] WAF logging enabled
- [ ] CloudTrail enabled for API auditing

