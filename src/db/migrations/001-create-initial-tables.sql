-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique not null,
  full_name text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.profiles
  for each row execute procedure public.handle_new_user();

-- Create tweet table
CREATE TABLE tweets (
  id UUID PRIMARY KEY,
  text text not null,
  author_id UUID not null,
  created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at  timestamp with time zone default timezone('utc'::text, now()) not null,
  FOREIGN KEY (author_id) REFERENCES profiles (id)
);

-- Create hashtag table
CREATE TABLE hashtags (
  id UUID PRIMARY KEY,
  name text
);

-- Create tweet_hashtag junction table for many-to-many relationship
CREATE TABLE tweet_hashtag (
  tweet_id UUID,
  hashtag_id UUID,
  PRIMARY KEY (tweet_id, hashtag_id),
  FOREIGN KEY (tweet_id) REFERENCES tweets (id) ON DELETE CASCADE,
  FOREIGN KEY (hashtag_id) REFERENCES hashtags (id) ON DELETE CASCADE
);

-- Create reply table
CREATE TABLE replies (
  id UUID PRIMARY KEY,
  text text not null,
  user_id UUID not null,
  tweet_id UUID,
  reply_id UUID,
  FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE,
  FOREIGN KEY (tweet_id) REFERENCES tweets (id) ON DELETE CASCADE,
  FOREIGN KEY (reply_id) REFERENCES replies (id) ON DELETE CASCADE
);

-- Create like table
CREATE TABLE likes (
  id UUID PRIMARY KEY,
  user_id UUID not null,
  tweet_id UUID not null,
  created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
  FOREIGN KEY (user_id) REFERENCES profiles (id),
  FOREIGN KEY (tweet_id) REFERENCES tweets (id),
  UNIQUE (user_id, tweet_id)
);

-- Create bookmark table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID,
  tweet_id UUID,
  created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
  FOREIGN KEY (user_id) REFERENCES profiles (id),
  FOREIGN KEY (tweet_id) REFERENCES tweets (id)
);