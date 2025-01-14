-- name: getAllUsers
SELECT id, username, name, email, role FROM user;

-- name: countUsers
SELECT COUNT(1) as count FROM user;

-- name: createUser
INSERT INTO user (id, username, name, email, password, role)
VALUES ($id, $username, $name, $email, $password, $role);

-- name: getUserByUsername
SELECT id, username, name, email, role FROM user WHERE username = ?;

-- name: getUserByUsernameWithPassword
SELECT id, username, name, email, role, password FROM user WHERE username = ?;

-- name: getUserById
SELECT id, username, name, email, role FROM user WHERE id = ?;

-- name: getUserByIdWithPassword
SELECT id, username, name, email, role, password FROM user WHERE id = ?;

-- name: updateUserById
UPDATE user SET username = $username, name = $name, email = $email, role = $role WHERE id = $id;

-- name: updateUserByIdWithPassword
UPDATE user SET username = $username, name = $name, email = $email, role = $role, password = $password WHERE id = $id;

-- name: removeUserById
DELETE FROM user WHERE id = ?;

-- name: usernameTaken
SELECT 1 FROM user WHERE username = ?;

-- name: usernameTakenExcludingId
SELECT 1 FROM user WHERE username = ? AND id != ?;

-- name: emailTaken
SELECT 1 FROM user WHERE email = ?;

-- name: emailTakenExcludingId
SELECT 1 FROM user WHERE email = ? AND id != ?;

-- name: updateUserPassword
UPDATE user SET password = ? WHERE id = ?;
