-- Migration: Add UNIQUE constraint to email field
-- This prevents race condition duplicates at the database level

-- Create new table with unique constraint
CREATE TABLE IF NOT EXISTS leads_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  role TEXT,
  team_size TEXT,
  use_case TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Copy data, removing duplicates (keeps first occurrence by lowest id)
INSERT INTO leads_new (email, role, team_size, use_case, created_at)
SELECT email, role, team_size, use_case, created_at
FROM leads
WHERE id IN (
  SELECT MIN(id)
  FROM leads
  GROUP BY email
);

-- Drop old table and rename new one
DROP TABLE leads;
ALTER TABLE leads_new RENAME TO leads;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
