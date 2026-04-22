-- Add tsvector column for full-text search on Listing title + description
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate existing rows
UPDATE "Listing"
SET search_vector = to_tsvector('simple',
  coalesce(title, '') || ' ' || coalesce(description, ''));

-- GIN index for fast FTS queries
CREATE INDEX IF NOT EXISTS listing_search_idx ON "Listing" USING GIN(search_vector);

-- Auto-update function
CREATE OR REPLACE FUNCTION listing_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: fires before INSERT or UPDATE
DROP TRIGGER IF EXISTS listing_search_vector_trigger ON "Listing";
CREATE TRIGGER listing_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Listing"
  FOR EACH ROW EXECUTE FUNCTION listing_search_vector_update();
