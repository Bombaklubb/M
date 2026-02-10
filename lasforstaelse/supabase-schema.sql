-- Supabase SQL Schema för Läsresan
-- Kör detta i Supabase SQL Editor för att sätta upp databasen

-- Tabell för användare med synkronisering
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  user_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index för snabb sökning på synkkod
CREATE INDEX IF NOT EXISTS idx_users_sync_code ON users(sync_code);

-- Row Level Security (RLS) - tillåt alla att läsa/skriva (för skolmiljö)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy för att tillåta anonym läsning med synkkod
CREATE POLICY "Allow anonymous read with sync_code" ON users
  FOR SELECT
  USING (true);

-- Policy för att tillåta anonym insert
CREATE POLICY "Allow anonymous insert" ON users
  FOR INSERT
  WITH CHECK (true);

-- Policy för att tillåta anonym update med sync_code
CREATE POLICY "Allow anonymous update" ON users
  FOR UPDATE
  USING (true);

-- Trigger för att uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
