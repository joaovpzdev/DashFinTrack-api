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
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email VARCHAR(100);
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password VARCHAR(100);

        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'users'
              AND column_name = 'name'
        ) THEN
            UPDATE public.users
            SET first_name = COALESCE(first_name, NULLIF(split_part(name, ' ', 1), ''), name)
            WHERE first_name IS NULL;

            UPDATE public.users
            SET last_name = COALESCE(
                last_name,
                NULLIF(substr(name, length(split_part(name, ' ', 1)) + 2), ''),
                'legacy'
            )
            WHERE last_name IS NULL;
        END IF;

        UPDATE public.users
        SET first_name = 'legacy'
        WHERE first_name IS NULL;

        UPDATE public.users
        SET last_name = 'legacy'
        WHERE last_name IS NULL;

        UPDATE public.users
        SET email = CONCAT('legacy-', id::text, '@local.invalid')
        WHERE email IS NULL;

        UPDATE public.users
        SET password = 'legacy'
        WHERE password IS NULL;

        ALTER TABLE public.users ALTER COLUMN first_name SET NOT NULL;
        ALTER TABLE public.users ALTER COLUMN last_name SET NOT NULL;
        ALTER TABLE public.users ALTER COLUMN email SET NOT NULL;
        ALTER TABLE public.users ALTER COLUMN password SET NOT NULL;

        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'users'
              AND column_name = 'name'
        ) THEN
            ALTER TABLE public.users DROP COLUMN name;
        END IF;

        CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
            ON public.users(email);
    END IF;
END
$$;

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

