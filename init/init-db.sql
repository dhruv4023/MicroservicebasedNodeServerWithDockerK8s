SELECT 'Initializing databases...' AS message;

CREATE DATABASE IF NOT EXISTS posts_db;
CREATE DATABASE IF NOT EXISTS main_db;  -- must be last created as it used to test health of database connection