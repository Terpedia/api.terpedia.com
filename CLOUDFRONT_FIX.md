# CloudFront Fix for kb.terpedia.com

## Issue
CloudFront distribution for `kb.terpedia.com` was blocking POST requests, preventing the API from working.

## Solution Applied

### Distribution ID
- **ID**: `E3QJM987I0J9EG`
- **Domain**: `kb.terpedia.com`
- **Origin**: `kb.terpedia.com.s3-website-us-east-1.amazonaws.com`

### Changes Made

1. **Updated Default Cache Behavior**:
   - **Before**: Only `HEAD`, `GET`
   - **After**: `HEAD`, `DELETE`, `POST`, `GET`, `OPTIONS`, `PUT`, `PATCH`
   - **Cached Methods**: `HEAD`, `GET`, `OPTIONS` (POST not cached)

2. **Added Cache Behavior for `/v1/*`**:
   - **Path Pattern**: `/v1/*`
   - **Allowed Methods**: All HTTP methods (POST, GET, etc.)
   - **Caching**: Disabled (TTL = 0)
   - **Forward Headers**: Authorization, Content-Type, Accept
   - **Forward Query Strings**: Yes

## Deployment Status

CloudFront updates take **15-20 minutes** to deploy globally.

### Check Status
```bash
aws cloudfront get-distribution --id E3QJM987I0J9EG --query "Distribution.Status" --output text
```

### Test Once Deployed
```bash
# Test POST request
curl -X POST https://kb.terpedia.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"terpedia/unified","messages":[{"role":"user","content":"test"}]}'
```

## Expected Result

Once deployed:
- ✅ POST requests to `/v1/*` will be allowed
- ✅ API endpoints will work
- ✅ Terpedia models in LibreChat will function
- ✅ No caching on API endpoints (always fresh)

## Verification

After deployment completes, verify:
1. POST requests work: `curl -X POST https://kb.terpedia.com/v1/chat/completions ...`
2. Terpedia models work in LibreChat
3. No more 403 errors from CloudFront

## Notes

- The distribution is currently in "InProgress" status
- Wait for status to change to "Deployed" before testing
- Changes propagate to all CloudFront edge locations globally
