-- ============================================================================
-- Security fix: enable Row-Level Security on public tables that were exposed via
-- Supabase's PostgREST API without RLS (Supabase linter: rls_disabled_in_public).
--
-- Why this is safe here:
--  * The website reads/writes ONLY through Prisma, connecting as the `postgres`
--    role, which OWNS these tables. On non-forced RLS the table owner BYPASSES
--    policies — verified live (enabling RLS in a rolled-back tx left owner reads
--    intact). No anon key is used anywhere in the site.
--  * The bureau-bot writes the bot_* tables through the Supabase SERVICE_ROLE
--    key, which also bypasses RLS.
--  * The `anon` / `authenticated` roles (i.e. the public REST API) get NO policy,
--    so RLS denies them by default — closing the public read/write hole.
--
-- Enabling RLS with no policy = deny-all for every non-bypassing role. That is
-- exactly the intent: nothing on this DB is meant to be read via the public API.
-- Re-running is harmless (idempotent flag). NOT `force` — that would block the
-- owner too and break the app.
-- ============================================================================

-- Website tables (Prisma, owner = postgres) --------------------------------
alter table "Visit"                enable row level security;
alter table "Event"                enable row level security;
alter table "PageStat"             enable row level security;
alter table "LeadStatusHistory"    enable row level security;
alter table "KpProposal"           enable row level security;
alter table "KpEvent"              enable row level security;
alter table "ClientRoomRevision"   enable row level security;
alter table "ClientStageRevision"  enable row level security;

-- bureau-bot tables (Supabase service_role key, bypasses RLS) ---------------
alter table "bot_conversations"     enable row level security;
alter table "bot_messages"          enable row level security;
alter table "bot_files"             enable row level security;
alter table "bot_summaries"         enable row level security;
alter table "bot_projects"          enable row level security;
alter table "bot_action_items"      enable row level security;
alter table "bot_stage_transitions" enable row level security;
