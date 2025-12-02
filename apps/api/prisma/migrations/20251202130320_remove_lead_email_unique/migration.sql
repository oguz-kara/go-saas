-- Remove unique constraint from Lead email to allow multiple leads with same email
DROP INDEX IF EXISTS "Lead_email_key";