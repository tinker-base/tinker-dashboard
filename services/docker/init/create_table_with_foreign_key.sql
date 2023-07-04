CREATE OR REPLACE PROCEDURE create_table_with_foreign_key_and_constraints(
    table_name VARCHAR,
    column_definitions VARCHAR,
    foreign_key_definition VARCHAR,
    constraint_definitions VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE format('CREATE TABLE %I (%s, %s, %s)',
        table_name,
        column_definitions,
        foreign_key_definition,
        constraint_definitions
    );
END;
$$;