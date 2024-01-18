CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    capital VARCHAR(255),
    continent VARCHAR(20) NOT NULL,
    photo TEXT,
    description TEXT
)

-- get counties
SELECT * FROM countries WHERE country = country