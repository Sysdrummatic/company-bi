-- Create companies table
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  krs_nip_or_hrb text not null,
  status text not null,
  description text not null,
  country text not null,
  industry text not null,
  employee_count text not null,
  founded_year integer not null,
  address text not null,
  website text not null,
  contact_email text not null,
  phone_number text not null,
  revenue text not null,
  management text[] not null default '{}',
  products_and_services text[] not null default '{}',
  technologies_used text[] not null default '{}',
  last_updated timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.companies enable row level security;

-- Policies

-- Public Read: Everyone can read public companies
create policy "Public companies are viewable by everyone"
  on public.companies for select
  using ( is_public = true );

-- Owner Read: Users can read their own companies (even private ones)
create policy "Users can see their own companies"
  on public.companies for select
  using ( auth.uid() = user_id );

-- Owner Insert: Authenticated users can insert companies
create policy "Users can insert their own companies"
  on public.companies for insert
  with check ( auth.uid() = user_id );

-- Owner Update: Users can update their own companies
create policy "Users can update their own companies"
  on public.companies for update
  using ( auth.uid() = user_id );

-- Owner Delete: Users can delete their own companies
create policy "Users can delete their own companies"
  on public.companies for delete
  using ( auth.uid() = user_id );

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_companies_updated_at
  before update on public.companies
  for each row
  execute procedure public.handle_updated_at();
