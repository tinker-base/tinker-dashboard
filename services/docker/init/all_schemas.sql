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