CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    note TEXT NOT NULL
)

-- create trip
INSERT INTO trips (title, destination, note) 
VALUES (title, destination, note)

-- get trip
SELECT * FROM trips WHERE id = $1