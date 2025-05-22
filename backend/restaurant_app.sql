-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 22 Μάη 2025 στις 20:25:25
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `restaurant_app`
--
CREATE DATABASE IF NOT EXISTS `restaurant_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `restaurant_app`;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` varchar(10) DEFAULT NULL,
  `people` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `restaurant_id`, `date`, `time`, `people`, `created_at`) VALUES
(14, 14, 1, '2025-05-08', '20:00', 4, '2025-05-07 16:32:28'),
(31, 17, 1, '2025-05-21', '21:00', 3, '2025-05-21 19:34:20'),
(32, 18, 1, '2025-05-21', '20:00', 4, '2025-05-21 19:44:51');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `cuisine` varchar(255) NOT NULL,
  `price_per_person` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `location`, `cuisine`, `price_per_person`) VALUES
(1, 'La Pizzeria', 'Athens', 'Italian', 25),
(2, 'Sushi Bar', 'Thessaloniki', 'Japanese', 15),
(3, 'Taverna O Kipos', 'Crete', 'Greek', 20);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'John Doe', 'johndoe@example.com', '$2b$10$4IohjERe2clnMdJkB24U7unU.VghiMsgxT6T4EbZ7nEq1ch1HtPGy'),
(4, 'Johny Doe', 'johnydoe@example.com', '$2b$10$OJ7QDC052EME0z50rfqOR.4kAymv43OYKhOhNfsmTsCfkwTp16.lS'),
(5, 'mike', 'example@mail.com', '$2b$10$9WekDSFeOorFEnmsJZa55.QfrpPXJyc69p4qnHIbyMc.A7zAbQ1I.'),
(7, 'Giorgos', 'giorgos@example.com', '$2b$10$U9LBLkfAY.pLCM7l6BGVMeI8qZqs63DDufwqVafIbkNQ196AQoeCO'),
(14, 'user1', 'user1@gmail.com', '$2b$10$TP0XRTKfD4RfZTr6OcCTT.dlMSq0Wx8XvtuOcDoNvq7DuBdT2z0Vi\r\n'),
(16, 'user6', 'user6@gmail.com', '$2b$10$VZfjVAANaTCaAeACGL1I3.XLQJh.1gEeKlI1cp6JHEMgzJP0UO.sO'),
(17, 'user5', 'user@gmail.com', '$2b$10$5q5dEHbA0YoMBPlGbckjFuzO06QARDZoKL6GUUvHN7yAPpnyODs2.'),
(18, 'user2', 'user2@gmail.com', '$2b$10$inSr2NeYBfrvQN4sSlhuhu2D0qNDkTw8LBmRo6fIBejUfXdqa.5hy');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `restaurant_id` (`restaurant_id`);

--
-- Ευρετήρια για πίνακα `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT για πίνακα `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
