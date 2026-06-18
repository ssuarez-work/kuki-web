-- ============================================================
-- Kuki Business — Esquema inicial (Supabase / PostgreSQL)
-- Aplica con: supabase db push  (o pega en el SQL Editor del proyecto)
-- ============================================================

-- ---------- Tablas ----------

-- Empresas cliente (1:1 con un usuario de auth)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  name text not null,
  rfc text,
  contact_name text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now()
);

-- Catálogo de prendas
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null,                 -- polo_premium | dry_fit | cuello_redondo
  description text,
  image_url text,
  stock int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tarifas por volumen (tabulador)
create table if not exists public.price_tiers (
  id uuid primary key default gen_random_uuid(),
  product_type text not null,         -- coincide con products.type
  min_qty int not null,
  max_qty int,                        -- null = "y más"
  price_per_unit numeric(10, 2) not null
);

-- Pedidos
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  status text not null default 'pago_pendiente'
    check (status in ('pago_pendiente','pago_confirmado','en_diseno','en_produccion','enviado','entregado','cancelado')),
  items jsonb not null default '[]'::jsonb,  -- [{type, name, qty, unit_price}]
  logo_path text,                            -- ruta en Storage (bucket logos)
  subtotal numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  delivery_method text,                      -- merida | nacional
  postal_code text,
  total numeric(10, 2) not null default 0,
  currency text not null default 'MXN',
  stripe_session_id text,
  created_at timestamptz not null default now()
);

-- Repositorio de diseños aprobados
create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  file_path text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists orders_company_idx on public.orders (company_id);
create index if not exists designs_company_idx on public.designs (company_id);

-- ---------- Row Level Security ----------
alter table public.companies enable row level security;
alter table public.products enable row level security;
alter table public.price_tiers enable row level security;
alter table public.orders enable row level security;
alter table public.designs enable row level security;

-- Catálogo y tarifas: lectura pública
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (true);

drop policy if exists "price_tiers_public_read" on public.price_tiers;
create policy "price_tiers_public_read" on public.price_tiers for select using (true);

-- Empresas: cada usuario gestiona la suya
drop policy if exists "companies_owner_all" on public.companies;
create policy "companies_owner_all" on public.companies
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Pedidos: solo los de la empresa del usuario
drop policy if exists "orders_owner_all" on public.orders;
create policy "orders_owner_all" on public.orders
  for all using (
    company_id in (select id from public.companies where user_id = auth.uid())
  ) with check (
    company_id in (select id from public.companies where user_id = auth.uid())
  );

-- Diseños: solo los de la empresa del usuario
drop policy if exists "designs_owner_all" on public.designs;
create policy "designs_owner_all" on public.designs
  for all using (
    company_id in (select id from public.companies where user_id = auth.uid())
  ) with check (
    company_id in (select id from public.companies where user_id = auth.uid())
  );

-- ---------- Trigger: crear empresa al registrarse ----------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.companies (user_id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'company_name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Storage (bucket privado de logos) ----------
insert into storage.buckets (id, name, public)
values ('logos', 'logos', false)
on conflict (id) do nothing;

-- Cada usuario sube/lee dentro de su propia carpeta: logos/<auth.uid()>/...
drop policy if exists "logos_user_rw" on storage.objects;
create policy "logos_user_rw" on storage.objects
  for all to authenticated
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- Seed: productos ----------
insert into public.products (slug, name, type, description, image_url, stock) values
  ('polo-premium-corporativo', 'Polo Premium Corporativo', 'polo_premium', 'Polo de algodón premium, ideal para uniformes corporativos.', '/img/products/polo-corporativo-personalizado.webp', 500),
  ('polo-premium-manga-larga', 'Polo Premium Manga Larga', 'polo_premium', 'Polo premium de manga larga.', '/img/products/polo-corporativo-personalizado.webp', 300),
  ('playera-deportiva-dry-fit', 'Playera Deportiva Dry-Fit', 'dry_fit', 'Tela deportiva transpirable de secado rápido.', '/img/products/playera-deportiva-dry-fit-personalizada.webp', 400),
  ('jersey-deportivo', 'Jersey Deportivo', 'dry_fit', 'Jersey deportivo personalizable.', '/img/products/playera-deportiva-dry-fit-personalizada.webp', 250),
  ('cuello-redondo-clasica', 'Cuello Redondo Clásica', 'cuello_redondo', 'Playera cuello redondo de algodón.', '/img/products/playera-cuello-redondo-personalizada.webp', 600),
  ('cuello-redondo-premium', 'Cuello Redondo Premium', 'cuello_redondo', 'Cuello redondo premium de mayor gramaje.', '/img/products/playera-cuello-redondo-personalizada.webp', 450)
on conflict (slug) do nothing;

-- ---------- Seed: tarifas por volumen ----------
insert into public.price_tiers (product_type, min_qty, max_qty, price_per_unit) values
  ('polo_premium', 1, 5, 350), ('polo_premium', 6, 15, 290), ('polo_premium', 16, 49, 270), ('polo_premium', 50, 99, 250), ('polo_premium', 100, null, 230),
  ('dry_fit', 1, 5, 260), ('dry_fit', 6, 15, 210), ('dry_fit', 16, 49, 190), ('dry_fit', 50, 99, 175), ('dry_fit', 100, null, 160),
  ('cuello_redondo', 1, 5, 200), ('cuello_redondo', 6, 15, 150), ('cuello_redondo', 16, 49, 135), ('cuello_redondo', 50, 99, 120), ('cuello_redondo', 100, null, 110)
on conflict do nothing;
