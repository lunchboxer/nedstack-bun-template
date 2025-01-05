CREATE TABLE user (
	id TEXT PRIMARY KEY NOT NULL,
	username TEXT NOT NULL,
	name TEXT,
    email TEXT,
	password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX user_username_unique ON user (username);
CREATE UNIQUE INDEX user_email_unique ON user (email);
