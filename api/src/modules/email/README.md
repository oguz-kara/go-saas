# Email Module

This module handles email notifications for lead creation events.

## Features

- Customer confirmation emails for new leads
- Marketing team notifications with full lead details
- Configurable marketing email recipients per channel
- Handlebars-based HTML email templates
- Asynchronous event-driven email sending

## Configuration

Add the following environment variables to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# Email From Configuration
SMTP_FROM_NAME=DoluCRM
SMTP_FROM_EMAIL=noreply@dolucrm.com
```

## Templates

Email templates are located in `api/src/modules/email/templates/`:
- `customer-lead-confirmation.hbs` - Customer thank you email
- `marketing-new-lead.hbs` - Marketing team notification

Templates use Handlebars with partials for consistent styling:
- `partials/header.hbs` - Email header
- `partials/footer.hbs` - Email footer
- `partials/lead-details.hbs` - Reusable lead details section

## Usage

Emails are automatically sent when leads are created via the `lead.created` event. The system:

1. Sends a confirmation email to the customer
2. Notifies marketing team members (configured in channel's `marketingEmails`)
3. Includes full lead context (all fields including pain points, budget, etc.)

## Marketing Email Configuration

Marketing emails are configured per channel in the database:

```typescript
const channel = await prisma.channel.findFirst({
  where: { token: 'ch_main_tenant_1' },
  update: {
    marketingEmails: ['marketing@example.com', 'sales@example.com']
  }
})
```

## Testing

Run unit tests:
```bash
pnpm test -- email.service.spec email.handler.spec
```

## Architecture

- **EmailService**: Core email sending service with Nodemailer
- **OnLeadCreatedEmailHandler**: Event handler that listens to `lead.created` events
- **EmailModule**: NestJS module that provides the email functionality


