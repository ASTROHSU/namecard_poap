-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh TEXT,
  name_en TEXT,
  company_zh TEXT,
  company_en TEXT,
  title_zh TEXT,
  title_en TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  website TEXT,
  social JSONB DEFAULT '{}',
  notes TEXT,
  card_image_url TEXT,
  poap_code TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POAP mint codes pool
CREATE TABLE IF NOT EXISTS poap_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  event_name TEXT,
  assigned_to UUID REFERENCES contacts(id),
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poap_codes_unassigned ON poap_codes(assigned_to) WHERE assigned_to IS NULL;
