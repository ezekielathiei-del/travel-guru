# Travel Guru email notifications setup

This upgrade is wired to send an internal alert and a customer acknowledgement after each package booking or custom trip enquiry. It uses a Supabase Edge Function and Resend. API keys remain server-side.

## Required before emails can be sent
1. A Resend account.
2. A domain the client owns and can verify in Resend.
3. The client's notification inbox address.
4. A sender address on the verified domain, e.g. `Travel Guru <bookings@clientdomain.com>`.

## 1. Verify the sender domain in Resend
Add the client's domain in Resend and publish the DNS records Resend provides at the domain registrar. Wait for verification. Use a sender address on that verified domain.

## 2. Add Supabase Edge Function secrets
In Supabase Dashboard > Edge Functions > Secrets, set:
- `RESEND_API_KEY`: Resend API key
- `ADMIN_NOTIFICATION_EMAIL`: inbox for Travel Guru alerts
- `FROM_EMAIL`: verified sender, e.g. `Travel Guru <bookings@clientdomain.com>`
- `SUPABASE_URL`: project URL (normally supplied automatically in Edge Functions)
- `SUPABASE_SERVICE_ROLE_KEY`: service-role secret (normally supplied automatically; set only if not present)

Never put the Resend key or service-role key in HTML, browser JavaScript, `supabase-config.js`, or chat.

## 3. Create the email log table
Open Supabase SQL Editor and run the full contents of `supabase/email-notification-log.sql`. The table prevents duplicate notification sends for the same saved booking/enquiry.

## 4. Deploy the Edge Function
Install the Supabase CLI. From this extracted project folder run:
```bash
supabase login
supabase link --project-ref awavgxgychqmbcrqnttb
supabase functions deploy travel-notifications --no-verify-jwt
```
`supabase/config.toml` also records `verify_jwt = false` for this public form-triggered function. The function only accepts a record type and UUID, then loads the saved row server-side; it does not accept arbitrary recipient addresses.

## 5. Test both flows
Submit a test package booking and a custom trip enquiry using an inbox you can access. Confirm the customer receives an acknowledgement and the Travel Guru inbox receives an internal alert. Check spam/promotions folders.

A request is saved before email is attempted. If email fails, the request remains saved and the website shows a warning.

## Still needed from the client
- Email address that should receive booking and enquiry alerts.
- Domain/sender address that can be verified for sending.
- Final business contact details to replace current website placeholders.
