\c nc_games_test
SELECT 
                    reviews.review_id,
                    reviews.owner,
                    reviews.title,
                    reviews.category,
                    reviews.review_img_url,
                    reviews.votes,
                    reviews.created_at,
                  COUNT(comments.comment_id) AS comment_count
                  FROM reviews LEFT JOIN comments on reviews.review_id = comments.review_id
GROUP BY reviews.review_id ORDER BY reviews.review_id ASC;

SELECT * FROM comments;