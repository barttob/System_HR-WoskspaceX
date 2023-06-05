module.exports = {
  up: "CREATE TABLE `users` (`user_id` int unsigned NOT NULL AUTO_INCREMENT,`login` varchar(255) NOT NULL,`password` varchar(255) NOT NULL,`user_role` varchar(255) NOT NULL,`first_name` varchar(255) NOT NULL,`last_name` varchar(255) NOT NULL,`email` varchar(255) NOT NULL,`address_id` int unsigned NOT NULL,`phone` varchar(255) NOT NULL,`birth_date` datetime NOT NULL,`img_url` mediumtext NOT NULL,PRIMARY KEY (`user_id`),KEY `users_address_id_foreign` (`address_id`),CONSTRAINT `users_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`));",
  down: "DROP TABLE IF EXISTS `users`;",
};
