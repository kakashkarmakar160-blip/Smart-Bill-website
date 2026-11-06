# Security — Read Before Real Use

- `AK1234` is a public demo password in client-side JavaScript. It is not authentication and can be bypassed.
- Settings password change is browser-session-only.
- Never publish a Supabase `service_role` or secret key. Only publishable/anon key may be in the browser.
- Keep Row Level Security enabled.
- Current policies are a starter placeholder for Supabase-authenticated users; they are not owner-only. Configure Supabase Auth and replace policies with owner/admin-only authorization before storing customer or financial data.
- This static demo login does not create a Supabase Auth session. Therefore database requests may be denied by RLS even if the URL and publishable key are correct.
- Do not solve this by adding unrestricted `anon` policies or disabling RLS.
- Use server-side validation for invoice totals, GST, discounts, stock changes and invoice numbering.
- OCR is not guaranteed accurate. Verify product name and MRP before adding.
- WhatsApp opens a prefilled message; user must press Send. A website cannot silently add a contact.
- Local demo fallback is browser-only and does not sync across devices.
