-- Enable the PG_READ_SERVER_FILES capability
CREATE EXTENSION IF NOT EXISTS "plpgsql_check";

-- Create a function to execute SQL statements
CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql_string;
END;
$$;