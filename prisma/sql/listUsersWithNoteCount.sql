SELECT
    u.id,
    u.name,
    u.email,
    COUNT(n.id) AS note_count
FROM "User" AS u
    LEFT JOIN "Note" AS n ON u.id = n."userId"
WHERE u.id = $1
GROUP BY u.id
ORDER BY note_count DESC;
