CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    place_tag text[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo TEXT NOT NULL,
    content TEXT NOT NULL
)

-- create blogs
INSERT INTO blogs (user_id, title, place_tag, photo, content) 
VALUES (user_id, title, place_tag, photo, content)

-- get blogs
SELECT *
FROM blogs
LIMIT pageSize
OFFSET offset

-- get blogs with 2 tags
SELECT *
FROM blogs
WHERE tag1 ILIKE ANY(place_tag)
  AND tag2 ILIKE ANY(place_tag)
LIMIT 4;

-- get Blog
SELECT *
FROM blogs
WHERE id = id

-- get Searched Blogs
SELECT *
FROM blogs
WHERE title ILIKE '%title%'
LIMIT pageSize
OFFSET offset

-- get filtered tags
SELECT *
FROM blogs
WHERE tag ILIKE ANY(place_tag)
LIMIT limit
OFFSET offset

-- get blogs count
SELECT COUNT(*) FROM blogs

-- get filtered blog count
SELECT COUNT(*)
FROM blogs
WHERE tag ILIKE ANY(place_tag)

-- get searched blogs count
SELECT COUNT(*)
FROM blogs
WHERE title ILIKE '%title%'
