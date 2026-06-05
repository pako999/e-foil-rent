-- Migration: discount_codes
-- Run against your Neon database.

CREATE TYPE discount_source AS ENUM ('exit_intent', 'admin');

CREATE TABLE discount_codes (
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

CREATE INDEX discount_codes_email_idx ON discount_codes (email);
CREATE INDEX discount_codes_active_idx ON discount_codes (active);
