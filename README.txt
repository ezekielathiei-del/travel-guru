TRAVEL GURU WEBSITE - SECURE ADMIN EDITION

This edition includes:
- Public-facing travel website with enquiry, booking and custom trip request forms.
- Private admin sign-in at /admin.html.
- Central customer enquiry and booking storage through Supabase.
- Admin-only record viewing and status updates, enforced by PostgreSQL Row Level Security.
- No customer records saved to browser LocalStorage.

IMPORTANT: The backend is not live until you connect your own Supabase project. Follow SUPABASE_SETUP.md in full. The setup includes the database SQL, account creation and admin allowlisting instructions.

Do not upload a Supabase service_role key. Only the Project URL and publishable/anon key belong in supabase-config.js.

The package is a front-end integration and database setup kit. It does not create a Supabase account, deploy the site, configure your DNS, or enable card payments automatically. Update the placeholder contact email and WhatsApp number before launch.


Latest update: The public website now has one central Book Your Journey section with two options: Choose a Package or Create a Custom Trip. The former standalone Plan With Us enquiry section has been removed. The admin page remains separate.


EMAIL NOTIFICATIONS
See EMAIL_NOTIFICATIONS_SETUP.md. Requires Resend, a verified sender domain, Edge Function secrets, the email log SQL, and Supabase Edge Function deployment.
