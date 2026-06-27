-- Feedback & feature requests submitted from the wrkCam iOS app.
-- Separate table from `leads` (the marketing waitlist) so the two concerns stay decoupled.

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,                 -- 'bug' | 'feature' | 'general'
  message TEXT NOT NULL,
  contact_email TEXT,                 -- optional; user may submit anonymously
  app_version TEXT,                   -- e.g. "1.2.0 (45)"
  os_version TEXT,                    -- e.g. "iOS 18.1"
  device_model TEXT,                  -- e.g. "iPhone16,2"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
