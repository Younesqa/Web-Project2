-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2026 at 08:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `university_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`) VALUES
(1, 'System Admin', 'admin@ppu.edu', '$2y$10$jTUakWEwyjq9VExK9Gy8COEjCX/65CAQ6wz5TQfy2uSVaVfNbDzxK');

-- --------------------------------------------------------

--
-- Table structure for table `completed_courses`
--

CREATE TABLE `completed_courses` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `completion_status` enum('completed','passed','failed') DEFAULT 'completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `completed_courses`
--

INSERT INTO `completed_courses` (`id`, `student_id`, `course_id`, `grade`, `completion_status`) VALUES
(4, 1, 2, 'A', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `instructor` varchar(100) DEFAULT NULL,
  `schedule_info` varchar(100) DEFAULT NULL,
  `credits` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `semester` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_code`, `title`, `description`, `instructor`, `schedule_info`, `credits`, `capacity`, `department`, `semester`) VALUES
(1, 'COMP2311', 'Database Systems', 'Introduction to databases and SQL', 'Dr. Mahmoud', 'MWF 09:00', 3, 30, 'CS', 'Fall 2025'),
(2, 'COMP133', 'Programming 1', 'Introduction to programming using C++', 'Dr. Manal', 'TTH 10:00', 3, 25, 'CS', 'Fall 2025'),
(3, 'COMP234', 'Data Structures', 'Stacks, queues, linked lists and trees', 'Dr. Diaa', 'MWF 11:00', 3, 20, 'CS', 'Fall 2025'),
(4, 'MATH201', 'Calculus 1', 'Differential calculus basics', 'Dr. Ali', 'TTH 12:00', 3, 40, 'MATH', 'Fall 2025'),
(5, 'ENG101', 'English Communication', 'Academic English writing and speaking', 'Dr. Noor', 'MWF 01:00', 2, 35, 'ENG', 'Fall 2025'),
(6, 'COMP470', 'Data Visualization', 'Techniques for visualizing and presenting data effectively.', 'Dr. Zein', 'TTH 02:00', 3, 30, 'CS', 'Fall 2025'),
(8, 'COMP 254', 'OS', 'OS ', 'Dr. Radwan', 'MWF 1:00-2:15', 3, 30, 'CS', 'Fall 2025'),
(9, 'COMP 251', 'NLP', 'Make Chatbots', 'Diaa', 'STT 11:00-12:00', 3, 30, '0', 'Spring 2026');

-- --------------------------------------------------------

--
-- Table structure for table `course_prerequisites`
--

CREATE TABLE `course_prerequisites` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `prerequisite_course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_prerequisites`
--

INSERT INTO `course_prerequisites` (`id`, `course_id`, `prerequisite_course_id`) VALUES
(1, 3, 2),
(2, 1, 2),
(4, 8, 3),
(5, 9, 5);

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `student_id`, `course_id`, `registration_date`) VALUES
(5, 1, 5, '2026-05-16 12:38:02'),
(6, 1, 6, '2026-05-16 12:38:06'),
(7, 1, 3, '2026-05-16 14:08:20'),
(8, 1, 1, '2026-05-16 14:08:23'),
(9, 1, 4, '2026-05-16 14:08:28'),
(10, 2, 2, '2026-05-16 14:09:54'),
(11, 2, 6, '2026-05-16 14:10:02'),
(12, 2, 4, '2026-05-16 14:10:05'),
(13, 2, 5, '2026-05-16 14:10:06'),
(14, 3, 2, '2026-05-16 14:36:09'),
(15, 3, 6, '2026-05-16 14:36:16'),
(16, 3, 5, '2026-05-16 14:36:28'),
(17, 3, 4, '2026-05-16 14:36:35'),
(18, 1, 2, '2026-05-16 18:36:31');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(5) NOT NULL,
  `name` char(50) NOT NULL,
  `major` char(3) NOT NULL,
  `phone` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `major`, `phone`, `email`, `password`) VALUES
(1, 'Younes', 'CS', 568157042, 'younes@ppu.edu.ps', '$2y$10$5TZdN/.AwsuwK5Yviei4nukbnEGSChzUtyRTQh5jDgNxmrgs5sL7i'),
(2, 'Khaled', 'IT', 566666666, 'khaled@ppu.edu.ps', '$2y$10$5TZdN/.AwsuwK5Yviei4nukbnEGSChzUtyRTQh5jDgNxmrgs5sL7i'),
(3, 'Morad', 'CS', 568888888, 'morad@ppu.edu.ps', '$2y$10$5TZdN/.AwsuwK5Yviei4nukbnEGSChzUtyRTQh5jDgNxmrgs5sL7i');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `completed_courses`
--
ALTER TABLE `completed_courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_code` (`course_code`);

--
-- Indexes for table `course_prerequisites`
--
ALTER TABLE `course_prerequisites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `prerequisite_course_id` (`prerequisite_course_id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `NUM` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `completed_courses`
--
ALTER TABLE `completed_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `course_prerequisites`
--
ALTER TABLE `course_prerequisites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `completed_courses`
--
ALTER TABLE `completed_courses`
  ADD CONSTRAINT `completed_courses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `completed_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_prerequisites`
--
ALTER TABLE `course_prerequisites`
  ADD CONSTRAINT `course_prerequisites_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_prerequisites_ibfk_2` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
