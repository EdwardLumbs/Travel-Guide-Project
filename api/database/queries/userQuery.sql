CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_iata VARCHAR(3),
    photo TEXT,
    description TEXT
)

-- signup info
INSERT INTO users (username, email, password)
VALUES (username, email, password)

-- login 
SELECT * FROM users WHERE email = email

-- update user info
UPDATE users SET
  username = COALESCE(param_1, username),
  password = COALESCE(param_2, password),
  description = COALESCE(param_3, description),
  photo = COALESCE(param_4, photo),
WHERE id = req.params.id;

-- delete user
DELETE FROM users WHERE id = req.params.id

-- get user
SELECT username, photo
FROM users
WHERE id = id

-- get user blog count
SELECT COUNT(*) FROM blogs
WHERE user_id = id

-- get user trip count
SELECT COUNT(*) FROM trips
WHERE user_id = id