CREATE TABLE IF NOT EXISTS users (
    ID UUID PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'id'
          AND data_type IN ('character varying', 'text')
    ) THEN
        ALTER TABLE public.users
        ALTER COLUMN id TYPE UUID
        USING (
            CASE
                WHEN id::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
                    THEN id::uuid
                ELSE (
                    substr(md5(id::text), 1, 8) || '-' ||
                    substr(md5(id::text), 9, 4) || '-' ||
                    substr(md5(id::text), 13, 4) || '-' ||
                    substr(md5(id::text), 17, 4) || '-' ||
                    substr(md5(id::text), 21, 12)
                )::uuid
            END
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS transactions(
    ID UUID PRIMARY KEY,
    user_id UUID REFERENCES users(ID) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type transaction_type NOT NULL
);

