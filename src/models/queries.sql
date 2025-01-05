-- name: getAllUsers
SELECT id, username, name, email, role FROM user;

-- name: countUsers
SELECT COUNT(1) FROM user;

-- name: createUser
INSERT INTO user (id, username, name, email, password, role)
VALUES (?, ?, ?, ?, ?, ?);

-- name: getUserByUsername
SELECT id, username, name, email, role FROM user WHERE username = ?;

-- name: getUserByUsernameWithPassword
SELECT id, username, name, email, role, password FROM user WHERE username = ?;

-- name: getUserById
SELECT id, username, name, email, role FROM user WHERE id = ?;

-- name: getUserByIdWithPassword
SELECT id, username, name, email, role, password FROM user WHERE id = ?;

-- name: updateUserById
UPDATE user SET username = ?, name = ?, email = ?, role = ? WHERE id = ?;

-- name: updateUserByIdWithPassword
UPDATE user SET username = ?, name = ?, email = ?, role = ?, password = ? WHERE id = ?;

-- name: removeUserById
DELETE FROM user WHERE id = ?;

-- name: usernameTaken
SELECT EXISTS (SELECT 1 FROM user WHERE username = ?);

-- name: usernameTakenExcludingId
SELECT EXISTS (SELECT 1 FROM user WHERE username = ? AND id != ?);

-- name: emailTaken
SELECT EXISTS (SELECT 1 FROM user WHERE email = ?);

-- name: emailTakenExcludingId
SELECT EXISTS (SELECT 1 FROM user WHERE email = ? AND id != ?);

-- name: updateUserPassword
UPDATE user SET password = ? WHERE id = ?;
