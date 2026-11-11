# Travel Guru admin and booking checks

## Open correctly
- Extract this ZIP to a normal folder; do not run it from inside a ZIP preview or temporary archive.
- Open the `travel-guru` folder in VS Code and start Live Server from `index.html`.
- Open `http://127.0.0.1:5500/admin.html` (your port may differ). Do not use `file:///`.
- Reset the admin password if it was ever visible in a browser URL or screenshot.

## Admin login
- Sign in using the Supabase Auth email and newly reset password.
- The admin page calls `is_travel_guru_admin()` before showing customer data.
- If access is denied, check that the Auth user's UUID is in `public.admin_users`.
- The dashboard reads `inquiries` and `bookings`; authorised admins can update statuses.

## Test submissions
1. Submit a package booking with a future travel date and return date on or after it.
2. In Supabase Table Editor, verify a row in `public.bookings`.
3. Submit a custom trip and verify a row in `public.inquiries`.
4. Refresh the admin dashboard and check both records appear.
5. Change a status, refresh, and confirm the change remains.

## Limitations before public launch
- Forms create booking/enquiry requests only. They do not charge cards, guarantee availability, or confirm reservations.
- WhatsApp and email are still placeholders (`254700000000` and `hello@travelguru.com`); replace them with real business contacts.
- The publishable key is designed for browser use. Never place a service-role/secret key in the website.
- Keep Row Level Security enabled. Public visitors should only be able to insert requests; only authorised admins should read/update them.
