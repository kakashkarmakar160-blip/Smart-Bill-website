-- Compatibility upgrade for databases created with the earlier Smart Billing SQL.
-- Safe to run after 001_initial_schema.sql. Does not disable RLS.

alter table public.customers add column if not exists phone text;
alter table public.customers add column if not exists mobile text;
update public.customers set phone = mobile where phone is null and mobile is not null;
create unique index if not exists customers_phone_unique_idx
  on public.customers(phone) where phone is not null;

alter table public.products add column if not exists selling_price numeric(12,2) not null default 0;
alter table public.products add column if not exists cost_price numeric(12,2) not null default 0;
update public.products set selling_price = mrp
  where selling_price = 0 and mrp is not null;

alter table public.invoices add column if not exists customer_id uuid;
alter table public.invoices add column if not exists customer_phone text;
alter table public.invoices add column if not exists discount_rate numeric(5,2) not null default 0;
alter table public.invoices add column if not exists discount_amount numeric(12,2) not null default 0;
alter table public.invoices add column if not exists gst_rate numeric(5,2) not null default 0;
alter table public.invoices add column if not exists created_at timestamptz not null default now();
update public.invoices set customer_phone = customer_mobile
  where customer_phone is null and customer_mobile is not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'invoices_customer_id_fkey'
      and conrelid = 'public.invoices'::regclass
  ) then
    alter table public.invoices
      add constraint invoices_customer_id_fkey
      foreign key (customer_id) references public.customers(id) on delete set null;
  end if;
end $$;

alter table public.invoice_items add column if not exists unit_price numeric(12,2) not null default 0;
alter table public.invoice_items add column if not exists line_total numeric(12,2) not null default 0;
update public.invoice_items set unit_price = price
  where unit_price = 0 and price is not null;
update public.invoice_items set line_total = total
  where line_total = 0 and total is not null;

alter table public.shop_settings add column if not exists shop_address text;
alter table public.shop_settings add column if not exists shop_mobile text;
alter table public.shop_settings add column if not exists default_gst numeric(5,2) not null default 0;
alter table public.shop_settings add column if not exists default_discount numeric(5,2) not null default 0;
