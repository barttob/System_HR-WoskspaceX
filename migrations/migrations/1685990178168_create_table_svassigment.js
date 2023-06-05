module.exports = {
  up: "CREATE TABLE `supervisor_assigment` (`sv_assg_id` int unsigned NOT NULL AUTO_INCREMENT,`sv_id` int unsigned NOT NULL,`user_id` int unsigned NOT NULL,PRIMARY KEY (`sv_assg_id`),KEY `supervisor_assigment_user_id_foreign` (`user_id`),KEY `supervisor_assigment_sv_id_foreign` (`sv_id`),CONSTRAINT `supervisor_assigment_sv_id_foreign` FOREIGN KEY (`sv_id`) REFERENCES `users` (`user_id`),CONSTRAINT `supervisor_assigment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`))",
  down: "DROP TABLE IF EXISTS `supervisor_assigment`;",
};
