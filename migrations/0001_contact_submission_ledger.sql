CREATE TABLE IF NOT EXISTS contact_submission_ledger (
  dedupe_key TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sending', 'accepted', 'ambiguous')),
  message_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS contact_submission_ledger_expires_at_idx
  ON contact_submission_ledger (expires_at);
