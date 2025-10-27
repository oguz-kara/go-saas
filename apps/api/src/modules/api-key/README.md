# API Key Authentication Module

This module provides secure API key-based authentication for public endpoints, specifically designed for the marketing website to submit leads.

## Features

- **Secure API Key Generation**: Generate cryptographically secure API keys with SHA-256 hashing
- **Rate Limiting**: Protect endpoints with configurable rate limits per IP and per API key
- **Usage Tracking**: Monitor API key usage with statistics (usage count, last used date/IP)
- **Key Management**: Admin interface to create, list, and revoke API keys

## Environment Variables

Add these to your `.env` file:

```env
# CORS Configuration
CORS_ORIGIN=https://your-marketing-site.com,https://www.your-marketing-site.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000              # Time window in milliseconds (default: 60000 = 1 minute)
RATE_LIMIT_MAX_REQUESTS_PER_IP=10       # Max requests per IP per window (default: 10)
RATE_LIMIT_MAX_REQUESTS_PER_KEY=100     # Max requests per API key per window (default: 100)
```

## Usage

### 1. Generate an API Key (Admin Dashboard)

1. Log in to the admin dashboard
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Provide a descriptive name (e.g., "Marketing Website - Production")
5. **Copy the API key immediately** - it will only be shown once
6. Store the key securely in your marketing site's environment variables

### 2. Use the API Key (Marketing Website)

Make HTTP POST requests to the public lead creation endpoint:

```bash
curl -X POST https://your-api.com/api/public/leads \
  -H "Content-Type: application/json" \
  -H "X-API-Key: mk_live_your_api_key_here" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "jobTitle": "CEO",
    "website": "https://acme.com",
    "source": "GOOGLE_ADS",
    "message": "Interested in your SAAS product"
  }'
```

#### Available Lead Sources

- `WEBSITE` - Direct website form
- `GOOGLE_ADS` - Google Ads campaign
- `FACEBOOK_ADS` - Facebook Ads campaign
- `LINKEDIN_ADS` - LinkedIn Ads campaign
- `ORGANIC_SEARCH` - Organic search traffic
- `DIRECT_TRAFFIC` - Direct traffic
- `REFERRAL` - Referral source
- `SOCIAL_MEDIA` - Social media (general)
- `EMAIL_CAMPAIGN` - Email marketing
- `PAID_ADS` - Other paid ads
- `EVENT` - Event or conference
- `PARTNER` - Partner referral
- `OTHER` - Other sources

### 3. Handle Responses

**Success (201 Created):**
```json
{
  "success": true,
  "message": "Lead created successfully. We will contact you soon!",
  "leadId": "clxxxxxxxxxxxx"
}
```

**Rate Limit Exceeded (429 Too Many Requests):**
```json
{
  "statusCode": 429,
  "message": "Too many requests from this IP. Please try again later.",
  "retryAfter": 60
}
```

**Invalid API Key (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired API key"
}
```

**Validation Error (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "firstName should not be empty"],
  "error": "Bad Request"
}
```

## GraphQL API (Admin Only)

### Create API Key

```graphql
mutation CreateApiKey {
  createApiKey(input: { name: "Marketing Website - Production" }) {
    id
    name
    prefix
    plainKey  # Only returned once!
    isActive
    createdAt
    createdBy {
      id
      email
    }
  }
}
```

### List API Keys

```graphql
query ListApiKeys {
  listApiKeys {
    id
    name
    prefix
    isActive
    usageCount
    lastUsedAt
    lastUsedIp
    createdAt
    createdBy {
      email
    }
  }
}
```

### Revoke API Key

```graphql
mutation RevokeApiKey {
  revokeApiKey(id: "key_id_here") {
    id
    name
    isActive
  }
}
```

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables** to store API keys
3. **Rotate keys periodically** (recommended: every 90 days)
4. **Use different keys** for different environments (dev, staging, production)
5. **Monitor usage** regularly through the admin dashboard
6. **Revoke compromised keys** immediately
7. **Restrict CORS origins** to only your marketing website domains in production

## Rate Limiting

The system implements a sliding window rate limiter with two levels:

1. **Per IP Address**: Default 10 requests/minute
   - Protects against DDoS attacks
   - Applies to all requests from the same IP

2. **Per API Key**: Default 100 requests/minute
   - Prevents abuse of individual keys
   - Allows legitimate high-volume usage

Rate limits are enforced using Redis for distributed rate limiting across multiple API instances.

## Architecture

- **ApiKeyService**: Core business logic for key generation, validation, and management
- **ApiKeyGuard**: NestJS guard that validates API keys on protected endpoints
- **RateLimitGuard**: NestJS guard that enforces rate limits
- **LeadController**: REST controller with public endpoint for lead creation
- **ApiKeyResolver**: GraphQL resolver for admin API key management

## Database Schema

The `ApiKey` model includes:
- `id`: Unique identifier
- `name`: Descriptive name
- `keyHash`: SHA-256 hash of the actual key
- `prefix`: First 12 characters for display
- `isActive`: Whether the key is active
- `expiresAt`: Optional expiration date
- `usageCount`: Number of times used
- `lastUsedAt`: Last usage timestamp
- `lastUsedIp`: Last IP address that used the key
- `metadata`: JSON field for additional data
- Relations to `Channel` and `User` (creator)

