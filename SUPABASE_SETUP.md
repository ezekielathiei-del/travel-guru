# Travel Guru: Supabase connection and secure admin setup

Your Supabase project URL and publishable key have already been entered in `supabase-config.js`.
The publishable key is intended for browser use. Do not put a database password, secret key, or service-role key in website files.

## Step 1 — Create the database tables and security rules
1. Sign in to https://supabase.com/dashboard and open your Travel Guru project.
2. Open **SQL Editor** and choose **New query**.
3. Open `supabase-schema.sql` from this folder.
4. Copy the entire SQL file into the Supabase SQL Editor and click **Run**.
5. Confirm the query completes successfully.

This creates the enquiry and booking tables, enables row-level security, permits public visitors to submit requests, and restricts reading/updating customer records to authorised admin accounts.

## Step 2 — Create your administrator login
1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** and create your own admin email and a strong password.
3. Confirm the user is created.
4. Copy that user's **UUID** from the Users page.
5. Open **SQL Editor → New query** and run the following, replacing the placeholder with the exact UUID:

```sql
insert into public.admin_users (user_id)
values ('PASTE-ADMIN-USER-UUID-HERE');
```

Only add trusted staff members. Do not enable public sign-ups. Remove admin access by deleting that user's row from `public.admin_users`.

## Step 3 — Test before publishing
1. Upload the complete `travel-guru` folder to an HTTPS static host.
2. In Supabase **Authentication → URL Configuration**, set your live website URL as the Site URL and add the live website and `/admin.html` URLs to the allowed redirect URLs.
3. Open the public site and submit a test enquiry, booking request, and custom trip request.
4. Visit `/admin.html`, sign in with your admin account, and confirm the records appear.
5. Test a status update and sign out.

## Security and launch notes
- The admin page is not linked from visitor navigation. The actual security boundary is Supabase authentication plus the database row-level security policies.
- Never expose the Supabase service-role/secret key in browser code.
- Public visitors can insert new records but cannot read customer records.
- Before a high-traffic launch, add CAPTCHA/anti-spam protection and server-side rate limiting.
- Replace the placeholder WhatsApp number (`254700000000`) and email (`hello@travelguru.com`) with Travel Guru's real contact details.
- The booking form submits a booking request only. It does not charge a card or confirm inventory.
- Existing browser LocalStorage test records are not automatically migrated.
- Enable MFA for admin accounts and use strong unique passwords.

## Records stored
- Enquiries: customer name, email, phone, destination, travel date, traveller count, message and status.
- Booking requests: reference, contact details, package, dates, traveller count, room preference, special requests, estimated total and status.
- Custom trip requests: contact details and the customer's trip preferences, stored as an enquiry.
