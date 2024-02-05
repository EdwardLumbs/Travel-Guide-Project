CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    note TEXT
)

-- create trip
INSERT INTO trips (title, destination, note) 
VALUES (title, destination, note)