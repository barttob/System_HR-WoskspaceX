module.exports = {
  up: "CREATE TABLE `contracts` (`contract_id` int unsigned NOT NULL AUTO_INCREMENT,`user_id` int unsigned NOT NULL,`start_date` date NOT NULL,`end_date` date NOT NULL,`rate` float NOT NULL,`contract_type` varchar(255) NOT NULL,PRIMARY KEY (`contract_id`),KEY `contracts_user_id_foreign` (`user_id`),CONSTRAINT `contracts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`));",
  down: "DROP TABLE IF EXISTS `contracts`;",
};
