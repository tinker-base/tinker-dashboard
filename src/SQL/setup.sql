-- Tinker DB setup

CREATE SCHEMA auth;

--private users table for Tinker backend
CREATE TABLE auth.users (
  email text PRIMARY KEY CHECK (email ~* '^.+@.+\..+$'::text),
  password text NOT NULL CHECK (length(password) < 512),
  username text UNIQUE NOT NULL,
  role  text NOT NULL
);

-- roles (authenticator, admin and anon) setup for frontend JWt

CREATE ROLE authenticator LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER;

CREATE ROLE admin superuser LOGIN PASSWORD'password' CREATEDB REPLICATION CREATEROLE;

GRANT admin TO authenticator;

CREATE ROLE anon NOINHERIT;

GRANT anon TO authenticator;

GRANT USAGE ON SCHEMA auth TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon;

-- backend JWT auth setup

-- needed pkg for encryption
create extension if not exists pgcrypto;


-- encrypt a password whenever a password is added / updated in the users table
create or replace function
auth.encrypt_password() returns trigger as $$
begin
  if tg_op = 'INSERT' or new.password <> old.password then
    new.password = crypt(new.password, gen_salt('bf'));
  end if;
  return new;
end
$$ language plpgsql;

-- this trigger is what whatches for insert or updates to passwords in users table
drop trigger if exists encrypt_password on auth.users;
create trigger encrypt_password
  before insert or update on auth.users
  for each row
  execute procedure auth.encrypt_password();

-- return type used in login function
CREATE TYPE auth.jwt AS (
  token text
);

--store the secret as a property of the db (uses custon function set_db_secret())
SELECT auth.set_db_secret('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI');
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI';

-- Install package 'pgjwt' for JWT generation in PSQL
-- git clone https://github.com/michelp/pgjwt.git
-- cd ./path/to/pgjwt
-- make install

-- then create extension for pgjwt
CREATE EXTENSION pgjwt;

-- login should be on your exposed (public) schema
-- login function takes email and password and returns the JWT if login successful
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

-- uses the pgjwt package to sign and create the JWT
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

-- grant anon role access to login function
grant execute on function login(text,text) to anon;