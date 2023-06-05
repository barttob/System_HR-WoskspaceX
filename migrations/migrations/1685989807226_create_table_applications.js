module.exports = {
  up: "CREATE TABLE `emp_applications` (`app_id` int unsigned NOT NULL AUTO_INCREMENT,`app_type` enum('L4','Urlop') DEFAULT NULL,`from_date` datetime DEFAULT NULL,`to_date` datetime DEFAULT NULL,`app_desc` varchar(255) DEFAULT NULL,`user_id` int unsigned DEFAULT NULL,`approved` tinyint(1) DEFAULT '0',PRIMARY KEY (`app_id`),KEY `user_id` (`user_id`),CONSTRAINT `emp_applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`));",
  down: "DROP TABLE IF EXISTS `emp_applications`;",
};
