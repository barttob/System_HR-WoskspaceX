module.exports = {
  up: "CREATE TABLE `salaries` (`salary_id` int unsigned NOT NULL AUTO_INCREMENT,`user_id` int unsigned NOT NULL,`contract_id` int unsigned NOT NULL,`from_date` date NOT NULL,`to_date` date NOT NULL,`salary_gross` int NOT NULL,`salary_net` int NOT NULL,`contract_type` varchar(255) NOT NULL,PRIMARY KEY (`salary_id`),KEY `salaries_user_id_foreign` (`user_id`),KEY `salaries_contract_id_foreign` (`contract_id`),CONSTRAINT `salaries_contract_id_foreign` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`),CONSTRAINT `salaries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`));",
  down: "DROP TABLE IF EXISTS `salaries`;",
};
