# Setting Up Marketing Email Notifications

When a lead is created, your system will send emails to:
1. **Customer** - Confirmation email
2. **Your Team** - Notification email with full lead details

## Configure Your Team Email Addresses

### Option 1: Using the CLI Command (Recommended)

1. Edit the email addresses in `api/src/seeder/commands/update-marketing-emails.command.ts`:
   ```typescript
   marketingEmails: [
     'your-email@example.com',
     'team-member1@example.com',
     'team-member2@example.com',
   ]
   ```

2. Run the command:
   ```bash
   cd api
   pnpm cli update:marketing-emails
   ```

### Option 2: Direct Database Update

Run this SQL query directly in your PostgreSQL database:

```sql
UPDATE "Channel" 
SET "marketingEmails" = ARRAY[
  'your-email@example.com', 
  'team-member1@example.com', 
  'team-member2@example.com'
]
WHERE token = 'ch_main_tenant_1';
```

### Option 3: Update Existing Database Record

If you're running the seeder again, update `api/src/seeder/seeders/seed-channel.seeder.ts`:

```typescript
const channelsToSeed = [
  {
    token: 'ch_main_tenant_1',
    name: 'Main Tenant',
    description: 'Main Tenant',
    marketingEmails: [
      'your-email@example.com',
      'team-member1@example.com',
    ],
  },
]
```

Then run:
```bash
cd api
pnpm cli seed:channels
```

## Verify Configuration

To check if emails are configured, you can query the database:

```sql
SELECT "token", "name", "marketingEmails" FROM "Channel";
```

## How It Works

When a new lead is created:
- The system fetches the channel's `marketingEmails` array
- Sends a detailed notification email to all addresses in that array
- The email includes full lead context (name, company, budget, pain points, etc.)

## Email Format

Your team will receive an email with:
- Lead contact information (name, email, phone, company)
- Lead status and priority
- Product interests
- Budget and timeline
- Pain points and current solution
- Assigned team member (if applicable)


