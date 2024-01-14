CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    photo TEXT
)

-- signup info
INSERT INTO users (username, email, password)
VALUES (username, email, password)

-- login 
SELECT * FROM users WHERE email = email