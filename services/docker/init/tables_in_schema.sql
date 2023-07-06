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