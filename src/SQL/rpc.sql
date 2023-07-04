
-- get all tables within a given schema
CREATE OR REPLACE FUNCTION tables_in_schema(schema text)
RETURNS TABLE (table_name text)
AS $$
BEGIN
    RETURN QUERY
    SELECT t.table_name::text
    FROM information_schema.tables t
    WHERE t.table_schema = schema;
END;
$$
LANGUAGE plpgsql;

-- get all schemas within the DB gREST is connected to (postgres by default)
CREATE OR REPLACE FUNCTION all_schemas()
RETURNS TABLE (schema_name text)
AS $$
BEGIN
    RETURN QUERY
    SELECT schema_name
    FROM information_schema.schemata;
END;
$$
LANGUAGE plpgsql;

-- deprecated login function
-- CREATE OR REPLACE FUNCTION get_user(input_email TEXT, input_password TEXT)
-- RETURNS table (username text, role text) AS
-- $$

-- BEGIN
--   RETURN QUERY
--   SELECT auth.users.username, users.role
--   FROM auth.users
--   WHERE email = input_email
--     AND password = crypt(input_password, auth.users.password);

-- END;
-- $$
-- LANGUAGE plpgsql;

-- updated login function with jwt 
create or replace function
login(email text, password text) returns auth.jwt as $$
declare
  _role text;
  result auth.jwt;
begin
  -- check email and password
  select auth.user_role(email, password) into _role;
  
  if _role is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  select sign(
      row_to_json(r), current_setting('app.jwt_secret')
    ) as token
    from (
      select _role as role, login.email as email,
         extract(epoch from now())::integer + 60*60 as exp
    ) r
    into result;
  return result;
end;
$$ language plpgsql security definer;


-- get the role of the user logging in
create or replace function
auth.user_role(email text, password text) returns name
  language plpgsql
  as $$
begin
  return (
  select role from auth.users
   where users.email = user_role.email
     and users.password = crypt(user_role.password, users.password)
  );
end;
$$;

-- create or replace function
-- auth.get_secret() returns text
--   language plpgsql
--   as $$
-- begin
--   return (
--     select secret from auth.secret
--   );
-- end;
-- $$;

-- sign up and insert new user into auth.users table
CREATE OR REPLACE FUNCTION insert_user(email text, password text, username text, role text)
RETURNS BOOLEAN AS
$$
DECLARE
  insert_count integer;
BEGIN
  INSERT INTO auth.users (email, password, username, role) VALUES (insert_user.email, insert_user.password, insert_user.username, insert_user.role)
  RETURNING 1 INTO insert_count;

  IF insert_count > 0 THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$
LANGUAGE plpgsql;

-- checks uniqueness of new user email
CREATE OR REPLACE FUNCTION unique_user_email(email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  email_exists BOOLEAN;
BEGIN                  
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE users.email = unique_user_email.email
  ) INTO email_exists;
                                   
  IF email_exists THEN
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END; 
$$
LANGUAGE plpgsql;

--checks uniqueness of new user username
CREATE OR REPLACE FUNCTION unique_username(username TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  username_exists BOOLEAN;
BEGIN                  
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE users.username = unique_username.username
  ) INTO username_exists;
                                   
  IF username_exists THEN
    RETURN false;
  ELSE
    RETURN true;
  END IF;
END; 
$$
LANGUAGE plpgsql;

--store the secret as a property of the db
CREATE OR REPLACE FUNCTION auth.set_db_secret(secret TEXT)
RETURNS void AS
$$
BEGIN
  EXECUTE 'ALTER DATABASE postgres SET "app.jwt_secret" TO ' || quote_literal(secret);
END;
$$
LANGUAGE plpgsql;


create or replace function get_username(email text, password text) returns text
  as $$
begin
  return (
  select username from auth.users
   where users.email = get_username.email
     and users.password = crypt(get_username.password, users.password)
  );
end;
$$
language plpgsql;
