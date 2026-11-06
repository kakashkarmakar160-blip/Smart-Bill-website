-- Smart Billing initial schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.shop_settings (
 id uuid primary key default gen_random_uuid(),
 shop_name text,
 address text,
 phone text,
 gstin text,
 created_at timestamptz not null default now()
);

create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 mrp numeric(12,2) not null default 0,
 cost_price numeric(12,2) not null default 0,
 selling_price numeric(12,2) not null default 0,
 stock numeric(12,2) not null default 0,
 gst_rate numeric(5,2) not null default 5,
 created_at timestamptz not null default now()
);

create table if not exists public.customers (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 phone text not null unique,
 address text,
 created_at timestamptz not null default now()
);

create table if not exists public.invoices (
 id uuid primary key default gen_random_uuid(),
 invoice_number text not null unique,
 customer_id uuid references public.customers(id) on delete set null,
 customer_name text,
 customer_phone text,
 bill_type text not null check (bill_type in ('gst','non-gst')),
 subtotal numeric(12,2) not null default 0,
 discount_rate numeric(5,2) not null default 0,
 discount_amount numeric(12,2) not null default 0,
 gst_rate numeric(5,2) not null default 0,
 gst_amount numeric(12,2) not null default 0,
 grand_total numeric(12,2) not null default 0,
 created_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
 id uuid primary key default gen_random_uuid(),
 invoice_id uuid not null references public.invoices(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null,
 product_name text not null,
 quantity numeric(12,2) not null default 1,
 unit_price numeric(12,2) not null default 0,
 line_total numeric(12,2) not null default 0
);

create table if not exists public.payments (
 id uuid primary key default gen_random_uuid(),
 invoice_id uuid not null references public.invoices(id) on delete cascade,
 amount numeric(12,2) not null,
 payment_method text not null default 'cash',
 created_at timestamptz not null default now()
);

create table if not exists public.expenses (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 amount numeric(12,2) not null,
 expense_date date not null default current_date,
 notes text,
 created_at timestamptz not null default now()
);

create table if not exists public.stock_history (
 id uuid primary key default gen_random_uuid(),
 product_id uuid references public.products(id) on delete set null,
 change_amount numeric(12,2) not null,
 reason text,
 created_at timestamptz not null default now()
);

alter table public.shop_settings enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.stock_history enable row level security;

-- Starter policies for authenticated users. Configure Supabase Auth and restrict
-- write access to the shop owner/admin before production deployment.
do $$ begin
 create policy "authenticated read shop settings" on public.shop_settings for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage shop settings" on public.shop_settings for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage products" on public.products for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage customers" on public.customers for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage invoices" on public.invoices for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage invoice items" on public.invoice_items for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage payments" on public.payments for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage expenses" on public.expenses for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
 create policy "authenticated manage stock history" on public.stock_history for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
