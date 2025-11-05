-- Drop old function if it exists
DROP FUNCTION IF EXISTS public.exec_sql(text);

-- Create a function that returns query results as JSON
CREATE OR REPLACE FUNCTION public.query_schema(sql_string text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'SELECT to_jsonb(array_agg(row_to_json(t))) FROM (' || sql_string || ') t' INTO result;
  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.query_schema TO anon, authenticated, service_role;