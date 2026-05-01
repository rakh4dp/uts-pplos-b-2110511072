-- phpMyAdmin SQL Dump


CREATE DATABASE IF NOT EXISTS `db_auth`;
USE `db_auth`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `created_at`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InlvZ2EiLCJlbWFpbCI6InJha2hheW9nYTk1QGdtYWlsLmNvbSIsImlhdCI6MTc3NzQ3OTcwNiwiZXhwIjoxNzc4MDg0NTA2fQ.SFRfL1Qo1jUKhkjGSp2g4gBf7oyL8sfuTRX19k4OpS0', '2026-04-29 16:21:46'),
(5, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InRlc3QgbG9naW4iLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzc3NTEzNzM0LCJleHAiOjE3NzgxMTg1MzR9.Fr5ut12XfRi50hQEIY0EjFChHomhoF0EfFydOwX0HmU', '2026-04-30 01:48:54'),
(6, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InRlc3QgbG9naW4iLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzc3NTEzNzc3LCJleHAiOjE3NzgxMTg1Nzd9._kQAJOTYgAIg9ZG2o0xg8VSkX6guKqLlWVo0gGBSzoA', '2026-04-30 01:49:37'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InlvZ2EiLCJlbWFpbCI6InJha2hheW9nYTk1QGdtYWlsLmNvbSIsImlhdCI6MTc3NzUxNDE1MSwiZXhwIjoxNzc4MTE4OTUxfQ.J7ft_5O5Ry8AWTqEPPKXJ2o_fC2Rtz7ypgCu-4ueYbM', '2026-04-30 01:55:51'),
(8, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InlvZ2EiLCJlbWFpbCI6InJha2hheW9nYTk1QGdtYWlsLmNvbSIsImlhdCI6MTc3NzUxOTY2OSwiZXhwIjoxNzc4MTI0NDY5fQ.yRC7aLvssWPrLn-lT7fzpt5UPiIYnpS_oCmvycsPPDg', '2026-04-30 03:27:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `provider` varchar(50) NOT NULL DEFAULT 'local',
  `provider_id` varchar(255) DEFAULT NULL,
  `display_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_pic` text DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `provider`, `provider_id`, `display_name`, `email`, `profile_pic`, `password`) VALUES
(1, 'google', '102725091088995147584', 'yoga', 'rakhayoga95@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLGEoCzeyvrRhiIDHS_IWH-TeddrcBwsz9jS53AYG5hOejfQg=s96-c', NULL),
(2, 'local', NULL, 'test login', 'test@gmail.com', NULL, '$2b$10$ytM6QoqXDNo19RpP.Xgyn.3Ls7Bt3NwaLvcTpcvCUHZ8kv44pCQdS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;
