module.exports = {
  up: "CREATE TABLE `calendar` (`event_id` int unsigned NOT NULL AUTO_INCREMENT,`user_id` int unsigned NOT NULL,`event_date_start` datetime NOT NULL,`event_date_end` datetime NOT NULL,`event_name` varchar(255) NOT NULL,`event_desc` varchar(255) NOT NULL,PRIMARY KEY (`event_id`),KEY `calendar_user_id_foreign` (`user_id`),CONSTRAINT `calendar_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`))",
  down: "DROP TABLE IF EXISTS `calendar`;",
};
