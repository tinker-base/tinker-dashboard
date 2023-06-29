CREATE OR REPLACE FUNCTION get_user(input_email TEXT, input_password TEXT)
RETURNS TEXT AS
$$
DECLARE
  username TEXT;
BEGIN
  SELECT users.username INTO username
  FROM users
  WHERE users.email = input_email
    AND users.password = input_password;

  RETURN username;
END;
$$
LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION insert_user(input_email text, input_password text, input_username text)
RETURNS BOOLEAN AS
$$
DECLARE
  insert_count integer;
BEGIN
  INSERT INTO users (email, password, username) VALUES (input_email, input_password, input_username)
  RETURNING 1 INTO insert_count;

  IF insert_count > 0 THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION unique_user_email(input_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  email_exists BOOLEAN;
BEGIN                  
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE users.email = input_email
  ) INTO email_exists;
                                   
  IF email_exists THEN
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END; 
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION unique_username(input_username TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  username_exists BOOLEAN;
BEGIN                  
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE users.username = input_username
  ) INTO username_exists;
                                   
  IF username_exists THEN
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END; 
$$
LANGUAGE plpgsql;
