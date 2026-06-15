-- Migration: discount_codes
-- Safe to re-run: every statement uses IF NOT EXISTS / DO blocks.
-- Run against your Neon database via the SQL Editor in the Neon console.

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_source') THEN
    CREATE TYPE discount_source AS ENUM ('exit_intent', 'admin');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS discount_codes (
  code text PRIMARY KEY,
  percent_off integer NOT NULL,
  source discount_source NOT NULL,
  email text,
  expires_at timestamptz,
  max_uses integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS discount_codes_email_idx ON discount_codes (email);
CREATE INDEX IF NOT EXISTS discount_codes_active_idx ON discount_codes (active);
