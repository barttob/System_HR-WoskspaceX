module.exports = {
  up: "CREATE TABLE `accomodation` (`acc_id` int unsigned NOT NULL AUTO_INCREMENT,`user_id` int unsigned NOT NULL,`address_id` int unsigned NOT NULL,`start_date` datetime NOT NULL,`end_date` datetime NOT NULL,`sv_id` int unsigned NOT NULL,PRIMARY KEY (`acc_id`),KEY `accomodation_address_id_foreign` (`address_id`),KEY `accomodation_sv_id_foreign` (`sv_id`),KEY `accomodation_user_id_foreign` (`user_id`),CONSTRAINT `accomodation_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`),CONSTRAINT `accomodation_sv_id_foreign` FOREIGN KEY (`sv_id`) REFERENCES `users` (`user_id`),CONSTRAINT `accomodation_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`))",
  down: "DROP TABLE IF EXISTS `accomodation`;",
};
