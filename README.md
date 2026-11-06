# Smart Billing Website

বাংলা-ভিত্তিক responsive OCR Billing Website starter.

## ফিচার
- পাসওয়ার্ড-গেটেড ডেমো লগইন (প্রাথমিক পাসওয়ার্ড `AK1234`)
- OCR camera capture (Tesseract.js; English/Latin label OCR)
- Product, customer, invoice, billing history
- Default GST ও Discount Settings — নতুন বিলের সব line item-এর subtotal-এর উপর global discount এবং taxable subtotal-এর উপর default GST
- GST / Non-GST invoice mode
- WhatsApp-এ message draft তৈরি (ব্যবহারকারী WhatsApp-এ Send চাপবেন)
- Date range sales report এবং filtered CSV export
- Supabase database schema starter

## চালানোর নিয়ম
1. ZIP extract করুন।
2. HTTPS hosting-এ upload করুন (GitHub Pages চলে) অথবা local server দিয়ে চালান।
3. Login: `AK1234`।
4. Settings → Database Connection-এ Supabase Project URL ও Publishable/Anon Key দিন।
5. `supabase/migrations/001_initial_schema.sql` Supabase SQL Editor-এ চালান।
6. Settings-এ Default GST ও Discount ঠিক করে Save করুন।

## Camera / OCR
Camera API সাধারণত HTTPS বা localhost-এ কাজ করে। ব্রাউজারকে camera permission দিতে হবে। OCR ফলাফল ভুল হতে পারে; নাম ও দাম যাচাই না করে বিল যোগ করবেন না। এই starter ইংরেজি/সংখ্যার OCR করে; বাংলা প্যাকেটের লেখা পড়ার জন্য বাংলা language model যোগ ও পরীক্ষা করতে হবে।

## GST গণনা
- Subtotal = সব পণ্যের selling price × quantity-এর যোগফল।
- Discount = Subtotal × default discount %।
- Taxable amount = Subtotal − Discount।
- GST = Taxable amount × default GST % (GST Bill-এ)।
- Grand Total = Taxable amount + GST।
- এটি একক default GST rate ব্যবহার করে। বিভিন্ন GST slab, inclusive MRP, HSN, CGST/SGST split, IGST, round-off, credit note ইত্যাদি দরকার হলে সেগুলো আলাদাভাবে বাস্তবায়ন ও যাচাই করতে হবে। প্রকৃত GST compliance-এর জন্য হিসাবরক্ষকের পরামর্শ নিন।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এই ZIP একটি কার্যকরী starter/demo, সম্পূর্ণ production-certified POS নয়। Supabase SDK যুক্ত করলে ডেটা টেবিলে লেখা/পড়া হবে, তবে এই starter-এর login এখনও demo-only এবং Supabase RLS policies authenticated Supabase users ধরে লেখা। বাস্তব ব্যবহারের আগে SECURITY.md অনুসরণ করে Supabase Auth, server-side session এবং owner-only RLS configure করুন।
