ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "verifierReputationScore" integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS "verifierApprovedReviews" integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "verifierRejectedReviews" integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "verifierIsBanned" boolean NOT NULL DEFAULT false;

ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "latitude" double precision,
  ADD COLUMN IF NOT EXISTS "longitude" double precision;

ALTER TABLE "verifications"
  ADD COLUMN IF NOT EXISTS "verifierLatitude" double precision,
  ADD COLUMN IF NOT EXISTS "verifierLongitude" double precision,
  ADD COLUMN IF NOT EXISTS "locationDistanceMeters" integer,
  ADD COLUMN IF NOT EXISTS "locationMatch" boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "verification_assignments" (
  "id" serial PRIMARY KEY,
  "milestoneId" integer NOT NULL,
  "projectId" integer NOT NULL,
  "assignedVerifierId" text NOT NULL,
  "assignedVerifierName" text,
  "status" text NOT NULL DEFAULT 'assigned',
  "decision" text,
  "report" text,
  "requiredConsensus" integer NOT NULL DEFAULT 1,
  "consensusReached" boolean NOT NULL DEFAULT false,
  "assignedAt" timestamp NOT NULL DEFAULT now(),
  "reviewedAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
