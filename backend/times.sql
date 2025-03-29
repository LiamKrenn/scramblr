CREATE TABLE IF NOT EXISTS times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  time INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  penalty SMALLINT DEFAULT 0,
  scramble VARCHAR(1024),
  comment VARCHAR(1024),
  timestamp TIMESTAMP,
  state SMALLINT DEFAULT 0
);


CREATE OR REPLACE FUNCTION set_times_state_to_synced()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.state = 2 THEN
    UPDATE times
    SET state = 0
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_update_set_synced_true
AFTER UPDATE ON times
FOR EACH ROW
EXECUTE FUNCTION set_times_state_to_synced();
