-- Stage 3: add services JSONB column to kp_proposals
-- Existing records keep old service/priceDesign/supervisionMonthly fields intact (backward compat).
-- New and updated records will store services as JSONB; old fields will be nulled on next admin save.

ALTER TABLE "KpProposal" ADD COLUMN IF NOT EXISTS "services" JSONB;
