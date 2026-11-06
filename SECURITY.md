# Security Notes — Read Before Public Use

## Demo password warning
The starter login gate contains a demo password (`AK1234`) in browser JavaScript. Anyone inspecting the source can discover or bypass it. The Settings password change is also browser/session-only. Do not use this as real access control on a public website.

## Production-ready approach
1. Enable Supabase Auth.
2. Create one owner account and sign in with Supabase Auth.
3. Store authorization roles in a protected table or app_metadata (not user-editable metadata).
4. Replace the demo login with `supabase.auth.signInWithPassword()`.
5. Use RLS policies that check the authenticated user's owner/admin role for INSERT/UPDATE/DELETE.
6. Never put the Supabase `service_role` or secret key in HTML, JavaScript, GitHub Pages, or browser settings. Only the publishable/anon key belongs in the browser.
7. Keep password changes within Supabase Auth; do not store plain passwords in tables or localStorage.
8. Add server-side validation for invoice totals, GST, discount, stock changes, and invoice numbering.
9. Restrict CORS and rate-limit any Edge Functions.
10. Back up the database and test restore before real business use.

## Current RLS starter policies
The SQL migration uses broad `authenticated` policies as a setup placeholder. They are NOT owner-only policies. Tighten them before storing real customer or financial information. The static shared-password login does not create a Supabase authenticated session, so database calls will be denied by these policies until Supabase Auth is implemented.

## Customer contacts / WhatsApp
A website cannot silently add a number to a phone's WhatsApp contacts. The Contact Picker API is browser/device-dependent and requires user permission. The `wa.me` share flow opens WhatsApp with a prefilled message; the user must press Send. The website cannot press Send on the user's behalf.
