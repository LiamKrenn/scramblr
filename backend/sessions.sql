CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  name VARCHAR(64),
  "order" SMALLINT DEFAULT 0,
  state SMALLINT DEFAULT 0
);


CREATE OR REPLACE FUNCTION set_sessions_state_to_synced()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.state = 2 THEN
    UPDATE sessions
    SET state = 0
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_update_set_synced_true
AFTER UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION set_sessions_state_to_synced();

CREATE TRIGGER after_create_set_synced_true
AFTER INSERT ON sessions
FOR EACH ROW
EXECUTE FUNCTION set_sessions_state_to_synced();
