CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    capital VARCHAR(255),
    continent_id INT REFERENCES continents(id),
    photo TEXT,
    description TEXT
)

CREATE TABLE continents (
    id SERIAL PRIMARY KEY,
    continent_name VARCHAR(20) NOT NULL,
    photo TEXT,
    description TEXT
)

-- get countries
SELECT * FROM countries WHERE country ILIKE country

-- get continents
SELECT * FROM continents WHERE continent_name ILIKE continent