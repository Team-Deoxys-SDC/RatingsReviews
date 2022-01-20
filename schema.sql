DROP DATABASE IF EXISTS RatingsReviews;
CREATE DATABASE RatingsReviews;
USE RatingsReviews;

CREATE TABLE Reviews (
  `review_id` INTEGER NOT NULL AUTO_INCREMENT,
  `rating` INTEGER NOT NULL,
  `summary` MEDIUMTEXT NOT NULL,
  `recommend` VARCHAR(10) NOT NULL,
  `response` MEDIUMTEXT DEFAULT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `date` DATETIME NOT NULL,
  `reviewer_name` VARCHAR(35) NOT NULL,
  `helpfulness` INT NOT NULL DEFAULT 0,
  `reported` VARCHAR(10) NOT NULL,
  `product_id` INT NOT NULL,
  `reviewer_email` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`review_id`)
);

CREATE TABLE Photos (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `review_id` INTEGER NOT NULL,
  `url` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE Ratings (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NOT NULL,
  `one_star` INTEGER NOT NULL DEFAULT 0,
  `two_stars` INTEGER NOT NULL DEFAULT 0,
  `three_stars` INTEGER NOT NULL DEFAULT 0,
  `four_stars` INTEGER NOT NULL DEFAULT 0,
  `five_stars` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE Characteristics (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NOT NULL,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE CharacteristicReviews (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `characteristic_id` INTEGER NOT NULL,
  `review_id` INT NOT NULL,
  `value` INT NOT NULL,
  PRIMARY KEY (`id`)
);

LOAD DATA LOCAL INFILE '/Users/zachfry/Downloads/reviews.csv'
INTO TABLE Reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(review_id,product_id,rating,@date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness)
SET date = FROM_UNIXTIME(SUBSTRING(@date,1,10));

ALTER TABLE Reviews ADD INDEX product_id_index (product_id);

LOAD DATA LOCAL INFILE '/Users/zachfry/Downloads/reviews_photos.csv'
INTO TABLE Photos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

ALTER TABLE Photos ADD INDEX review_id_index (review_id);

LOAD DATA LOCAL INFILE '/Users/zachfry/Downloads/characteristics.csv'
INTO TABLE Characteristics
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/Users/zachfry/Downloads/characteristic_reviews.csv'
INTO TABLE CharacteristicReviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

ALTER TABLE Characteristics ADD INDEX product_id_index (product_id);

ALTER TABLE CharacteristicReviews ADD INDEX characteristic_id_index (characteristic_id);

