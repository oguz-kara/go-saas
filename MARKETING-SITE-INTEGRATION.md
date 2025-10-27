# Marketing Site Integration Guide

This guide explains how to integrate your marketing website with the CRM API to securely submit leads.

## Overview

The CRM API provides a public REST endpoint for lead creation that uses API key authentication and implements rate limiting to prevent abuse. This allows your marketing website (or any external application) to submit leads without requiring user authentication.

## Setup Steps

### 1. Generate an API Key

1. Log in to the CRM admin dashboard
2. Navigate to **Settings > API Keys** (or click "API Keys" in the sidebar)
3. Click **"Generate New Key"**
4. Enter a descriptive name (e.g., "Marketing Website - Production")
5. **Copy the generated API key immediately** - it will only be shown once!
6. Store the key securely in your marketing site's environment variables

### 2. Configure Your Marketing Site

Add the API key to your environment variables:

```env
# .env or .env.local
NEXT_PUBLIC_CRM_API_URL=https://your-crm-api.com
CRM_API_KEY=mk_live_your_api_key_here
```

### 3. Implement Lead Submission

#### Example: Next.js Server Action

```typescript
// app/actions/submit-lead.ts
'use server'

export async function submitLead(formData: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  website?: string
  source: string
  message?: string
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CRM_API_URL}/api/public/leads`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.CRM_API_KEY!,
      },
      body: JSON.stringify(formData),
    }
  )

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.')
    }
    if (response.status === 401) {
      throw new Error('Invalid API key')
    }
    throw new Error('Failed to submit lead')
  }

  return await response.json()
}
```

#### Example: Contact Form Component

```tsx
// app/components/contact-form.tsx
'use client'

import { useState } from 'react'
import { submitLead } from '@/app/actions/submit-lead'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      await submitLead({
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string | undefined,
        company: formData.get('company') as string | undefined,
        jobTitle: formData.get('jobTitle') as string | undefined,
        message: formData.get('message') as string | undefined,
        source: 'WEBSITE', // or track from UTM parameters
      })
      
      setSuccess(true)
    } catch (error) {
      console.error('Failed to submit lead:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900">Thank you!</h3>
        <p className="text-green-700">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="firstName" placeholder="First Name" required />
      <input name="lastName" placeholder="Last Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" type="tel" placeholder="Phone" />
      <input name="company" placeholder="Company" />
      <input name="jobTitle" placeholder="Job Title" />
      <textarea name="message" placeholder="Message" rows={4} />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### 4. Track Lead Sources

Use the `source` field to track where leads come from:

#### Available Sources:
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

#### Example: Track UTM Parameters

```typescript
function getLeadSource(searchParams: URLSearchParams): string {
  const utmSource = searchParams.get('utm_source')
  const utmMedium = searchParams.get('utm_medium')
  
  if (utmSource === 'google' && utmMedium === 'cpc') {
    return 'GOOGLE_ADS'
  }
  
  if (utmSource === 'facebook') {
    return 'FACEBOOK_ADS'
  }
  
  if (utmSource === 'linkedin') {
    return 'LINKEDIN_ADS'
  }
  
  if (utmMedium === 'organic') {
    return 'ORGANIC_SEARCH'
  }
  
  return 'WEBSITE'
}
```

## API Reference

### Endpoint

```
POST /api/public/leads
```

### Headers

```
Content-Type: application/json
X-API-Key: your_api_key_here
```

### Request Body

```typescript
{
  firstName: string     // Required
  lastName: string      // Required
  email: string         // Required, must be valid email
  phone?: string        // Optional, max 20 characters
  company?: string      // Optional, max 200 characters
  jobTitle?: string     // Optional, max 100 characters
  website?: string      // Optional, max 500 characters
  source: string        // Required, one of the available sources
  message?: string      // Optional, max 1000 characters
}
```

### Response

**Success (201 Created):**
```json
{
  "success": true,
  "message": "Lead created successfully. We will contact you soon!",
  "leadId": "clxxxxxxxxxxxx"
}
```

**Rate Limit Exceeded (429):**
```json
{
  "statusCode": 429,
  "message": "Too many requests from this IP. Please try again later.",
  "retryAfter": 60
}
```

**Invalid API Key (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired API key"
}
```

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "firstName should not be empty"],
  "error": "Bad Request"
}
```

## Rate Limits

- **10 requests per minute per IP address**
- **100 requests per minute per API key**

If you exceed these limits, you'll receive a 429 error. Wait for the `retryAfter` seconds before retrying.

## Security Best Practices

1. **Never expose API keys in client-side code** - Always use server-side functions
2. **Store API keys in environment variables** - Never commit them to version control
3. **Use different keys for different environments** - Separate keys for dev, staging, and production
4. **Monitor API key usage** - Check the admin dashboard regularly
5. **Rotate keys periodically** - Generate new keys every 90 days
6. **Revoke compromised keys immediately** - Use the admin dashboard to revoke keys

## Troubleshooting

### "Invalid or expired API key"
- Verify the API key is correct
- Check if the key has been revoked in the admin dashboard
- Ensure the key hasn't expired

### "Too many requests"
- You've hit the rate limit
- Wait for the specified `retryAfter` time
- Consider implementing exponential backoff

### "CORS error"
- Ensure your domain is added to the CORS whitelist
- Contact your CRM administrator to add your domain

### Duplicate email handling
- The API automatically handles duplicate emails gracefully
- Returns success message even if email exists
- No error is shown to end users for privacy reasons

## Support

For issues or questions:
1. Check the API Keys page in the admin dashboard for usage statistics
2. Review server logs for detailed error messages
3. Contact your CRM administrator

## Environment Variables Required

### CRM API (Backend)
```env
CORS_ORIGIN=https://your-marketing-site.com,https://www.your-marketing-site.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS_PER_IP=10
RATE_LIMIT_MAX_REQUESTS_PER_KEY=100
```

### Marketing Site (Frontend)
```env
NEXT_PUBLIC_CRM_API_URL=https://your-crm-api.com
CRM_API_KEY=mk_live_your_api_key_here
```

