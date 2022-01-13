DROP DATABASE IF EXISTS RatingsReviews;
CREATE DATABASE RatingsReviews;
USE RatingsReviews;

CREATE TABLE `Reviews` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NOT NULL,
  `rating` INTEGER NOT NULL,
  `date` DATETIME NOT NULL,
  `summary` MEDIUMTEXT NOT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `recommend` VARCHAR(10) NOT NULL,
  `reported` VARCHAR(10) NOT NULL,
  `reviewer_name` VARCHAR(35) NOT NULL,
  `reviewer_email` VARCHAR(50) NOT NULL,
  `response` MEDIUMTEXT DEFAULT NULL,
  `helpfulness` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE Photos (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `review_id` INTEGER NOT NULL,
  `url` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Ratings` (
  `product_id` INTEGER NOT NULL,
  `one_star` INTEGER NOT NULL DEFAULT 0,
  `two_stars` INTEGER NOT NULL DEFAULT 0,
  `three_stars` INTEGER NOT NULL DEFAULT 0,
  `four_stars` INTEGER NOT NULL DEFAULT 0,
  `five_stars` INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES Reviews(`product_id`)
);

CREATE TABLE `Characteristics` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `product_id` INTEGER NOT NULL,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES Reviews(`product_id`)
);

CREATE TABLE `CharacteristicReviews` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `characteristic_id` INTEGER NOT NULL,
  `review_id` INT NOT NULL,
  `value` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Products` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(35) NOT NULL,
  `slogan` TEXT NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(20) NOT NULL,
  `default_price` DECIMAL(9, 2) NOT NULL,
  PRIMARY KEY (`id`)
)