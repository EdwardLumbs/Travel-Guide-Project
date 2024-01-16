CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
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