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
    continent_photo TEXT,
    continent_description TEXT
)

-- get country
SELECT *
FROM countries
JOIN continents 
ON continent_id = continents.id
WHERE country ILIKE country

-- get countries
SELECT country, continent_name, photo
FROM countries
JOIN continents 
ON continent_id = continents.id

-- get continent
SELECT *
FROM continents 
WHERE continent_name ILIKE continent

-- get continents
SELECT continent_name, continent_photo
FROM continents

-- get countries on continents
SELECT photo, country
FROM countries
JOIN continents 
ON continent_id = continents.id
WHERE continent_name ILIKE continent

-- filtering alphabetical
-- countries
SELECT country, continent_name, photo 
FROM countries 
JOIN continents  
ON continent_id = continents.id 
ORDER BY country
-- continents
SELECT continent_name, continent_photo
FROM continents
ORDER BY continent_name

-- search destinations
-- countries
SELECT country, continent_name, photo
FROM countries
JOIN continents
ON continent_id = continents.id
WHERE country ILIKE country
-- continents
SELECT continent_name, continent_photo
FROM continents
WHERE continent_name ILIKE continents

