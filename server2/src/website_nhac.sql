-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 31, 2024 at 03:27 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `website_nhac`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Yamaha', 'Renowned brand known for musical instruments like pianos and guitars.', '2024-08-31 19:51:35', '2024-08-31 19:51:35'),
(2, 'Gibson', 'Famous for its high-quality guitars and other musical instruments.', '2024-08-31 19:51:35', '2024-08-31 19:51:35'),
(3, 'Fender', 'Popular for its electric guitars and basses.', '2024-08-31 19:51:35', '2024-08-31 19:51:35'),
(4, 'Roland', 'Known for electronic musical instruments and equipment.', '2024-08-31 19:51:35', '2024-08-31 19:51:35');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `subTotal` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Guitar', 'Stringed instrument played by plucking or strumming. Available in various types like acoustic, electric, and bass.', '2024-08-31 19:48:30', '2024-08-31 19:48:30'),
(2, 'Piano', 'Keyboard instrument with keys that produce sound by striking strings. Available in grand, upright, and digital types.', '2024-08-31 19:48:30', '2024-08-31 19:48:30'),
(3, 'Drum', 'Percussion instrument that produces sound by striking a membrane. Includes various types such as snare, bass, and toms.', '2024-08-31 19:48:30', '2024-08-31 19:48:30'),
(4, 'Violin', 'String instrument played with a bow. Known for its use in classical and folk music.', '2024-08-31 19:48:30', '2024-08-31 19:48:30'),
(5, 'Flute', 'Woodwind instrument that produces sound by blowing across an opening. Available in various types including concert and piccolo.', '2024-08-31 19:48:30', '2024-08-31 19:48:30');

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `subTotal` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `shipping` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shipping`)),
  `deliver_status` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `paymentStatus` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productimages`
--

CREATE TABLE `productimages` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productimages`
--

INSERT INTO `productimages` (`id`, `product_id`, `imageUrl`, `createdAt`, `updatedAt`) VALUES
(5, 5, 'http://example.com/images/product1.jpg', '2024-08-31 20:07:30', '2024-08-31 20:07:30'),
(6, 6, 'http://example.com/images/product2.jpg', '2024-08-31 20:07:30', '2024-08-31 20:07:30'),
(7, 7, 'http://example.com/images/product3.jpg', '2024-08-31 20:07:30', '2024-08-31 20:07:30'),
(8, 5, 'http://example.com/images/product4.jpg', '2024-08-31 20:07:30', '2024-08-31 20:07:30');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `oldPrice` decimal(10,2) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `countInStock` int(11) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `oldPrice`, `brand_id`, `category_id`, `sub_category_id`, `countInStock`, `rating`, `isFeatured`, `discount`, `dateCreated`, `createdAt`, `updatedAt`) VALUES
(5, 'Yamaha Acoustic Guitar', 'High-quality acoustic guitar with a warm sound.', 299.99, 349.99, 1, 1, 1, 50, 4.50, 1, 10.00, '2024-08-31 20:01:32', '2024-08-31 20:01:32', '2024-08-31 20:01:32'),
(6, 'Gibson Les Paul', 'Iconic electric guitar with a rich tone and classic design.', 1999.99, 2199.99, 2, 1, 1, 20, 4.80, 1, 5.00, '2024-08-31 20:01:32', '2024-08-31 20:01:32', '2024-08-31 20:01:32'),
(7, 'Roland Digital Piano', 'Compact digital piano with excellent sound quality.', 499.99, 549.99, 4, 2, 1, 30, 4.30, 0, 8.00, '2024-08-31 20:01:32', '2024-08-31 20:01:32', '2024-08-31 20:01:32'),
(8, 'Fender Stratocaster', 'Versatile electric guitar with a classic feel.', 1299.99, 1399.99, 3, 1, 1, 25, 4.70, 1, 7.00, '2024-08-31 20:01:32', '2024-08-31 20:01:32', '2024-08-31 20:01:32');

-- --------------------------------------------------------

--
-- Table structure for table `productspecifications`
--

CREATE TABLE `productspecifications` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `spec_key` varchar(255) DEFAULT NULL,
  `spec_value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productspecifications`
--

INSERT INTO `productspecifications` (`id`, `product_id`, `spec_key`, `spec_value`, `createdAt`, `updatedAt`) VALUES
(1, 5, 'Material', 'Solid Wood', '2024-08-31 20:08:44', '2024-08-31 20:08:44'),
(2, 5, 'Color', 'Natural', '2024-08-31 20:08:44', '2024-08-31 20:08:44'),
(3, 6, 'Pickup Type', 'Humbucker', '2024-08-31 20:08:44', '2024-08-31 20:08:44'),
(4, 6, 'Number of Keys', '88', '2024-08-31 20:08:44', '2024-08-31 20:08:44');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('create-brands.js'),
('create-cart.js'),
('create-categories.js'),
('create-order-items.js'),
('create-orders.js'),
('create-payments.js'),
('create-product-images.js'),
('create-product-specifications.js'),
('create-products.js'),
('create-reviews.js'),
('create-sub-categories.js'),
('create-users.js');

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `subCat` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `category_id`, `subCat`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Electric Guitars', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(2, 1, 'Acoustic Guitars', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(3, 2, 'Grand Pianos', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(4, 2, 'Digital Pianos', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(5, 3, 'Acoustic Drums', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(6, 3, 'Electronic Drums', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(7, 4, 'Digital Flutes', '2024-08-31 19:53:10', '2024-08-31 19:53:10'),
(8, 4, 'Concert Flutes', '2024-08-31 19:53:10', '2024-08-31 19:53:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(7, 'amit1', '0899064191', NULL, '$2a$12$msl//WFdetzkKz1VgcFgh.sqdhUr75qhyF83rh3rlSYsOzc7oE.bG', '2024-08-31 04:55:27', '2024-08-31 04:55:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `productimages`
--
ALTER TABLE `productimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `sub_category_id` (`sub_category_id`);

--
-- Indexes for table `productspecifications`
--
ALTER TABLE `productspecifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productimages`
--
ALTER TABLE `productimages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `productspecifications`
--
ALTER TABLE `productspecifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84403;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `productimages`
--
ALTER TABLE `productimages`
  ADD CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`sub_category_id`) REFERENCES `subcategories` (`id`);

--
-- Constraints for table `productspecifications`
--
ALTER TABLE `productspecifications`
  ADD CONSTRAINT `productspecifications_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
