# Smart Billing Website (Repaired Starter)

বাংলা-ভিত্তিক responsive ওয়েবসাইট। ZIP-এর ভেতরের ফাইলগুলো সরাসরি GitHub repository-র root-এ আপলোড করতে হবে।

## GitHub Pages-এ সঠিকভাবে আপলোড
1. ZIP extract করুন।
2. Extract করা `Smart-Billing-Website` ফোল্ডারের **ভেতরের সব ফাইল ও ফোল্ডার** নির্বাচন করুন।
3. এগুলো GitHub repository-র root-এ upload করুন। `index.html` যেন repository-র প্রথম পাতাতেই থাকে।
4. `js` ফোল্ডারটি অবশ্যই অক্ষত রাখুন। এর মধ্যে `auth.js`, `common.js`, `billing.js`, `dashboard.js`, `products.js`, `customers.js`, `history.js`, `reports.js`, `settings.js` থাকবে।
5. GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save।
6. Pages প্রকাশ হলে সাইট খুলে একবার hard refresh করুন।

## Demo login
- Password: `AK1234`
- এটি শুধু সাময়িক demo gate। ব্রাউজারের JavaScript থেকে পাসওয়ার্ড দেখা/এড়িয়ে যাওয়া সম্ভব; বাস্তব নিরাপত্তা নয়।
- Settings-এ বদলানো demo password শুধু ওই browser session-এ থাকে।

## Supabase setup
1. Supabase SQL Editor-এ `supabase/migrations/001_initial_schema.sql` চালান।
2. আগে পুরনো SQL চালানো থাকলে `supabase/migrations/002_compatibility_upgrade.sql`-ও SQL Editor-এ চালান (এটি পুরনো কলামগুলোর সঙ্গে কোডের মিল করে)।\n3. Settings → Database Connection-এ Project URL এবং Publishable/anon key দিন। `service_role`/secret key কখনও দেবেন না।
4. Test Connection চালান।

**গুরুত্বপূর্ণ:** এই starter-এ এখনও Supabase Auth sign-in যুক্ত করা হয়নি। SQL-এর RLS policy `authenticated` Supabase session চায়। ফলে শুধু URL ও publishable key দিলেই database read/write অনুমোদিত হবে না। প্রকৃত shared cloud data চালুর আগে Supabase Auth login এবং owner-only RLS policy সম্পূর্ণ করতে হবে। RLS বন্ধ করবেন না এবং public/anon write policy যোগ করবেন না।

## Features
- Product package-এর লেখা ও MRP OCR (Tesseract.js; ইংরেজি/সংখ্যা; camera permission ও HTTPS দরকার)
- OCR ফলাফল যাচাই করে পণ্যের নাম/দাম সম্পাদনা
- এক বিলে একাধিক পণ্য, quantity, subtotal, discount, GST, grand total
- GST / Non-GST mode
- Customer details, invoice history, reports, filtered CSV export
- WhatsApp-এ prefilled bill message; WhatsApp-এ Send ব্যবহারকারী নিজে চাপবেন
- Default GST ও discount settings (একটি global rate; per-product slab নয়)

## Calculation
Discount = Subtotal × default discount rate.
GST bill-এর GST = (Subtotal − Discount) × default GST rate.
Non-GST bill-এ GST = 0.
এটি সাধারণ starter calculation; GST-inclusive MRP, আলাদা HSN/slab, CGST/SGST/IGST ও tax compliance-এর পূর্ণ ব্যবস্থা নয়।

## Demo data
Supabase Auth session না থাকলে কিছু পেজ local browser demo fallback ব্যবহার করে। এই fallback শুধু পরীক্ষার জন্য; অন্য ডিভাইসে sync হয় না এবং browser data clear করলে হারাতে পারে। আসল হিসাবের জন্য Auth + RLS সম্পূর্ণ না হওয়া পর্যন্ত ব্যবহার করবেন না।
