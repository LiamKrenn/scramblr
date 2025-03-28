CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  name VARCHAR(64),
  "order" SMALLINT DEFAULT 0,
  state SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS times (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  time INTEGER NOT NULL,
  penalty SMALLINT DEFAULT 0,
  scramble VARCHAR(1024),
  comment VARCHAR(1024),
  timestamp TIMESTAMP,
  state SMALLINT DEFAULT 0
);

CREATE OR REPLACE FUNCTION set_state_to_one()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.state = 0 THEN
    NEW.state := 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS before_update_set_times_state_to_one ON times;
CREATE TRIGGER before_update_set_times_state_to_one
BEFORE UPDATE ON times
FOR EACH ROW
EXECUTE FUNCTION set_state_to_one();

DROP TRIGGER IF EXISTS before_update_set_sessions_state_to_one ON sessions;
CREATE TRIGGER before_update_set_sessions_state_to_one
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION set_state_to_one();


