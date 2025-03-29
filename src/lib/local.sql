-- create sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  "order" SMALLINT DEFAULT 0,
  state SMALLINT DEFAULT 0,
  archived BOOLEAN DEFAULT FALSE NOT NULL
);

-- create times
CREATE TABLE IF NOT EXISTS times (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  time INTEGER NOT NULL,
  penalty SMALLINT DEFAULT 0,
  scramble VARCHAR(1024),
  comment VARCHAR(1024),
  timestamp TIMESTAMP,
  state SMALLINT DEFAULT 0,
  archived BOOLEAN DEFAULT FALSE NOT NULL
);

-- create trigger to set state to 1 if it was 0 before update
CREATE OR REPLACE FUNCTION set_state_to_one()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.state = 0 THEN
    NEW.state := 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create trigger for times
DROP TRIGGER IF EXISTS before_update_set_times_state_to_one ON times;
CREATE TRIGGER before_update_set_times_state_to_one
BEFORE UPDATE ON times
FOR EACH ROW
EXECUTE FUNCTION set_state_to_one();

-- create trigger for sessions
DROP TRIGGER IF EXISTS before_update_set_sessions_state_to_one ON sessions;
CREATE TRIGGER before_update_set_sessions_state_to_one
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION set_state_to_one();


-- session upsert function
CREATE OR REPLACE FUNCTION upsert_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the session ID already exists
  IF EXISTS (SELECT 1 FROM sessions WHERE id = NEW.id) THEN
    -- Update existing row with new values
    UPDATE sessions
    SET 
      name = NEW.name,
      "order" = NEW."order",
      state = NEW.state
    WHERE id = NEW.id;
    
    -- Suppress the original INSERT
    RETURN NULL;
  END IF;
  
  -- Proceed with INSERT if ID doesn't exist
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- times upsert function
CREATE OR REPLACE FUNCTION upsert_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the time ID already exists
  IF EXISTS (SELECT 1 FROM times WHERE id = NEW.id) THEN
    -- Update existing row with new values
    UPDATE times
    SET 
      session_id = NEW.session_id,
      time = NEW.time,
      penalty = NEW.penalty,
      scramble = NEW.scramble,
      comment = NEW.comment,
      timestamp = NEW.timestamp,
      state = NEW.state
    WHERE id = NEW.id;
    
    -- Suppress the original INSERT
    RETURN NULL;
  END IF;
  
  -- Proceed with INSERT if ID doesn't exist
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create the trigger for upserting sessions
DROP TRIGGER IF EXISTS sessions_upsert_trigger ON sessions;
CREATE TRIGGER sessions_upsert_trigger
BEFORE INSERT ON sessions
FOR EACH ROW
EXECUTE FUNCTION upsert_session();


-- Create the trigger for upserting times
DROP TRIGGER IF EXISTS times_upsert_trigger ON times;
CREATE TRIGGER times_upsert_trigger
BEFORE INSERT ON times
FOR EACH ROW
EXECUTE FUNCTION upsert_time();

DROP INDEX IF EXISTS idx_times_active;
CREATE INDEX idx_times_active ON times (session_id, timestamp, archived) INCLUDE (id, time, penalty);
