module.exports = {
  up: "CREATE TABLE `user_schedule` (`day_id` int unsigned NOT NULL AUTO_INCREMENT,`user_id` int unsigned NOT NULL,`day_status` varchar(255) NOT NULL,`event_id` int unsigned NOT NULL,PRIMARY KEY (`day_id`),KEY `user_schedule_event_id_foreign` (`event_id`),KEY `user_schedule_user_id_foreign` (`user_id`),CONSTRAINT `user_schedule_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `calendar` (`event_id`),CONSTRAINT `user_schedule_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`))",
  down: "DROP TABLE IF EXISTS `user_schedule`;",
};
