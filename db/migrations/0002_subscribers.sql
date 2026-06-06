-- Migration: subscribers
-- Safe to re-run. Run in Neon SQL Editor.

CREATE TABLE IF NOT EXISTS subscribers (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  marketing_consent boolean NOT NULL DEFAULT false,
  consent_source text,
  consented_at timestamptz,
  unsubscribed_at timestamptz,
  locale text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscribers_consent_idx ON subscribers (marketing_consent);
