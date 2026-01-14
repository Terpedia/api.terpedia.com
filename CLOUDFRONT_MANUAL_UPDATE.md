# CloudFront Manual Update Instructions

## Issue
The automated update is encountering an error: "The parameter CachedMethods is required"

## Manual Update Steps

### Option 1: AWS Console (Recommended)

1. Go to AWS CloudFront Console
2. Find distribution: `E3QJM987I0J9EG` (kb.terpedia.com)
3. Click "Behaviors" tab
4. Edit the default behavior:
   - **Allowed HTTP Methods**: Select "GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
   - **Cache Policy**: Use "CachingDisabled" or custom policy
   - **Origin Request Policy**: Forward Authorization, Content-Type, Accept headers
5. Add new behavior for `/v1/*`:
   - **Path Pattern**: `/v1/*`
   - **Allowed HTTP Methods**: All methods
   - **Cache Policy**: CachingDisabled
   - **Origin Request Policy**: Forward all headers
6. Save changes

### Option 2: Fix JSON and Retry

The config file at `/tmp/cf-config-final.json` needs to be verified. Check:
- All required fields present
- CachedMethods properly nested under AllowedMethods
- Cache behavior structure matches CloudFront API requirements

### Option 3: Use AWS CLI with Correct Structure

Ensure the JSON structure exactly matches CloudFront API requirements. The error suggests a missing or incorrectly structured CachedMethods parameter.

## Current Status

- **Distribution ID**: E3QJM987I0J9EG
- **Current Allowed Methods**: HEAD, GET only
- **Target**: Add POST, OPTIONS, PUT, PATCH, DELETE
- **Cache Behavior Needed**: `/v1/*` with no caching

## Verification

After update:
```bash
# Check allowed methods
aws cloudfront get-distribution-config --id E3QJM987I0J9EG \
  --query "DistributionConfig.DefaultCacheBehavior.AllowedMethods.Items"

# Test POST
curl -X POST https://kb.terpedia.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"terpedia/unified","messages":[{"role":"user","content":"test"}]}'
```
